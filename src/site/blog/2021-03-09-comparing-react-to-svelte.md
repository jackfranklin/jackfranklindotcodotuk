---
permalink: /blog/comparing-svelte-and-react-javascript/index.html
title: 'Comparing Svelte and React'
intro:
  "Today I'm comparing the same app built once in React, and once in Svelte, to
  look at the pros and cons of each library and how I think about them."
date: 2021-03-09
---

Last year I created [Pomodone](https://pomod.one/), a small time tracking
application based on the Pomodoro technique of working in 25 minute intervals.
It's a pretty basic app; it has a 25 minute timer (that runs in a Web Worker)
and saves a history of your "poms" to a small Firebase database. I initially
built it using React (well, Preact actually) but I then started to play around
with Svelte, and decided rebuilding the app in Svelte might be a nice way to
blog about the similarities and differences between the libraries.

This is **not a post declaring Svelte to be better than React, or vice-versa**.
This is a post where I'll tell you about my preferences, and what I find easier
or harder with either framework. I'm not here to pick a fight! Plus, Pomodone is
hardily a vastly complex application that could be used to fully put React or
Svelte through its paces. Think of this post as a commentary based on my
experience throwing a side project together, focusing on the developer
experience putting these components together.

### Authentication

The app uses Firebase Authentication to log a user in via either their GitHub or
Google account. I _love_ Firebase Authentication, it's such an easy way to add
auth to side projects.

React's hooks are a great way to package this up; I create a `useCurrentUser`
hook which listens out to authentication changes and sets some state
accordingly. I can then trust React to re-render as required when an
authentication change is noted.

```js
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(undefined)

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((details) => {
      setCurrentUser(
        details
          ? {
              displayName: details.displayName,
              provider: {
                'google.com': 'Google',
                'github.com': 'GitHub',
              }[details.providerData[0].providerId],
              uid: details.uid,
            }
          : null
      )
    })
  }, [])
  return [currentUser]
}
```

Within any component, I can write:

```js
const [currentUser] = useCurrentUser()
```

This is nice; it's low effort and lets any component quickly access the current
user. The only downside of this is that you potentially have many
`onAuthStateChanged` listeners; I could mitigate this by only binding one
listener, or by putting the current user in a
[context instead](https://reactjs.org/docs/context.html).

Talking of context, that's much closer to the approach I take with Svelte and
use a [writable store](https://svelte.dev/tutorial/writable-stores).

```js
export const currentUser = writable()

export const listenForAuthChanges = () => {
  return firebase.auth().onAuthStateChanged((details) => {
    if (details) {
      currentUser.set({
        displayName: details.displayName,
        provider: {
          'google.com': 'Google',
          'github.com': 'GitHub',
        }[details.providerData[0].providerId],
        uid: details.uid,
      })
    } else {
      currentUser.set(null)
    }
  })
}
```

Then, within the top level Svelte component, I can call this within `onMount`,
which will run once when the component is mounted (the function is `return`ed so
we unsubscribe when the component is removed, much like how `useEffect` lets you
return a function).

```js
onMount(() => {
  return listenForAuthChanges()
})
```

Now anywhere in my Svelte codebase, a component can import the `currentUser`
writable store, and act accordingly. What I like is that `currentUser` isn't a
value, it's a store, and therefore you have full control over how you deal with
it. You can either subscribe to it and manually control with state changes:

```js
currentUser.subscribe(newValue => {
  ...
})
```

Or, if you want to just read the latest value, you can prefix it with a `$`:

```js
console.log($currentUser)
```

This is where some of Svelte's syntax trickery begins to shine; this dollar
prefix trick automatically subscribes you to the store's latest value. I both
like and dislike this; it's a nice syntax once you know it, but it's a bit odd
as a beginner to get used to. However I like that Svelte doesn't make me use the
`subscribe` API every time I need to read the value.

As far as basic authentication goes, both libraries seem to take similar
approaches here. Whilst the terminology and exact syntax differs slightly, both
allow you to subscribe to a Firebase listener and get updated when the
authentication state changes. React's contexts and Svelte's stores play almost
identical roles for their library.

### Using a worker

Pomodone has to keep a 25 minute timer going and try to be as accurate as
possible. If a browser tab is backgrounded (e.g., not the focused tab), most
browsers will lower the priority of its `setTimeout` calls and not run them
strictly to time. Most of the time on the web this isn't a massive deal, but
when a user is tracking 25 minutes of work via your app, it is! Plus, over the
course of 25 minutes, any slight time drift will cause the final time to be
quite far off. However, if these timeouts are moved into a web worker, they
should run to time and not get de-prioritised by the browser.

Therefore, in my `Tracker` component, I need to instantiate a web worker, send
it messages and recieve data (such as time remaining) back. This is one area
where I found React more "admin heavy" than Svelte; because React components are
re-executed everytime the component re-renders, you can easily end up with
thousands of workers being created! It's essential to use
[useRef](https://reactjs.org/docs/hooks-reference.html#useref) to avoid this
problem by maintaining a reference to the worker that you've created.

Firstly I set up the initial state I need for the component:

```js
const [currentPom, setCurrentPom] = useState(null)
const [currentUser] = useCurrentUser()
const worker = useRef(null)
```

And then create a `useEffect` hook that will instantiate the worker, if
required, and bind an event listener to listen for messages:

```js
useEffect(() => {
  if (!worker.current) {
    worker.current = new Worker(workerURL)
    window.worker = worker.current
  }

  const onMessage = (event) => {
    if (event.data.name === 'tick') {
      setCurrentPom((currentPom) => ({
        ...currentPom,
        secondsRemaining: event.data.counter,
      }))
    } else if (event.data.name === 'start') {
      // More branches removed here to save space...
    }
  }
  worker.current.addEventListener('message', onMessage)

  return () => {
    worker.current.removeEventListener('message', onMessage)
  }
}, [currentUser])
```

And then, when the user hits the "Start" button, I have to send the worker a
message:

```js
const onStartPom = () => {
  if (!worker.current) return
  worker.current.postMessage('startTimer')
}
```

Svelte looks pretty similar, but has two small changes that personally make the
Svelte code easier to read, in my opinion:

1. We don't have to keep the worker in `useRef`, and can just assign it to a
   variable.
2. We can pull the event listener code out into a function more easily, as that
   function won't then become a dependency to a `useEffect` - at which point we
   will have to wrap it in `useCallback`.

Instantiating the worker is now:

```js
let worker
onMount(() => {
  worker = new Worker(workerURL)
  worker.addEventListener('message', onWorkerMessage)
  return () => {
    worker.removeEventListener('message', onWorkerMessage)
  }
})
```

We also don't have to set state by using React's `setX(oldX => newX)`
convention, and can just mutate the local variable:

```js
function onWorkerMessage(event) {
  if (event.data.name === 'tick') {
    currentPom = {
      ...currentPom,
      secondsRemaining: event.data.counter,
    }
  } else if (event.data.name === 'start') {
    // More branches here removed to save space...
  }
}
```

Here's where I start to have a preference for Svelte; the two are very similar
but once I got used to Svelte I found that React felt like jumping through
hoops. You can't create a worker instance, it has to go in a `useRef`, and then
you can't easily pull code out into a function without then requiring
`useCallback` so it can be a safe dependency on `useEffect`. With Svelte I write
code that's closer to "plain" JavaScript, whereas in React everything is wrapped
in a React primitive.

### Conditional rendering

One part of React that I've always championed is how _it's just JavaScript_. I
like that in React you don't use a distinct template syntax and instead embed
JavaScript, compared to Svelte's templating language:

<side-by-side first="React" second="Svelte" is-wide-example>

```jsx
<ul>
  {pomsForCurrentDay.map(entryData, index) => {
    const finishedAt = format(new Date(entryData.timeFinished), 'H:mm:ss')
    return <li title={`Finished at ${finishedAt}`}>{index + 1}</li>
  })}
</ul>
```

{% raw %}

```js
<ul class="poms-list">
  {#each currentDayPoms as value, index}
    <li
      title={`Finished at ${format(
        new Date(value.timeFinished),
        'H:mm:ss'
      )}`}
    >
      {index + 1}
    </li>
  {/each}
</ul>
```

{% endraw %}

</side-by-side>

I was pleasantly surprised by Svelte's templating; in the past I've found
templating languages overwhelming and inflexible, but Svelte offers just the
right amount of templating whilst enabling you to use JavaScript too. That said,
I will always find React's approach easier - at least in my head - and I think
more friendly to people familiar with JavaScript who are learning a library.

However, Svelte does have some nice touches to its syntax when it comes to
rendering components (which feels very JSX-like). My favourite is the ability to
collapse props:

<side-by-side first="Svelte" second="Svelte (collapsed props)">

{% raw %}

```jsx
<History pomodoros={pomodoros} />
```

<pre class="language-jsx"><code class="language-jsx"><span class="token tag"><span class="token punctuation">&lt;</span><span class="token class-name">History</span></span> <span class="token punctuation">{</span><span class="token class-name tag">pomodoros</span><span class="token punctuation">}</span><span class="token punctuation">/></span></span></code></pre>

{% endraw %}

</side-by-side>

This is something I've longed for with React!

### Reactivity in Svelte with \$

React requires us to use `useEffect` and other hooks because it fully controls
how all your code is run and re-runs your code whenever a component is
re-rendered. Svelte is different in that by default most of your code is only
going to run once; a `console.log('foo')` line in a component will only run when
that component is first rendered. In React, it will run many times.

React doing this has some benefits; let's say you are taking in a big list of
data and running some function to convert it into data that you can render. In
React, within your component, you can write:

```js
const input = props.inputData
const transformed = input.map((item) => transformItem(item))

return <div>{JSON.stringify(transformed, null, 2)}</div>
```

And this will always be up to date - should the user provide new
`props.inputData`, the component will re-render and the output will be updated.

The same is not true in Svelte:

```js
<script>
export let input;
const transformed = input.map((item) => transformItem(item))
</script>

<div>{JSON.stringify(transformed, null, 2)}</div>
```

Here the output will be rendered the first time the component is rendered, but
then not updated at all. We can solve this in two ways:

<side-by-side first="Using $" second="Transform in template" is-wide-example>

```js
<script>
export let input;
$: transformed = input.map((item) => transformItem(item))
</script>

<div>{JSON.stringify(transformed, null, 2)}</div>
```

```js
<script>
export let input;
</script>

<div>{JSON.stringify(input.map((item => transformItem(item))), null, 2)}</div>
```

</side-by-side>

This is another example of Svelte taking JavaScript syntax and using it for a
slightly different meaning; it tells Svelte that the statement is _reactive_ and
should be recalculate should any imports change. You might also call it a
"computed property". The second solution simply moves the logic into the
template, thus ensuring that when the component re-renders the logic is executed
again. In my time with Svelte this is the approach I've gone with most of the
time, often pulling out the logic into a function:

```js
<div>{calculateOutputForItems(input)}</div>
```

### Styling

### Conclusion

#### I don't miss useEffect
