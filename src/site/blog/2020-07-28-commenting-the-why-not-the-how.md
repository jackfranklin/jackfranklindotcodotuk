---
permalink: /blog/code-comments-why-not-how/index.html
title: 'Writing good comments: the why, not the how'
intro: 'My method for writing useful code comments.'
date: 2020-07-28
---

Code comments often get a bad reputation amongst developers as a waste of time,
or a sign that your code could be improved. Here's a quote from a
`CONTRIBUTING.md` file I found on GitHub (and there's many, many more like it):

> Comments should be avoided. If the code cannot be understood without comments,
> re-write the code to make it self-explanatory.

I think this is pretty poor, incorrect advice the vast majority of the time. I
think this stems back to most people's experience learning code. I have a strong
memory of a lecturer in my first term of my Computer Science degree (although
you'll find this advice in many courses, regardless of if it's University or
not) telling us:

> Every line of code should have a comment explaining what it does. Your
> upcoming coursework will be marked on this criteria.

So, if you're a new student fresh into the course, what do you do? You comment
your code of course!

```js
// set the input value from the ENV value bar
const inputValue = process.ENV.bar

// now multiply it by 2
const newValue = inputValue * 2

// now pass it to the square function
const finalValue = square(newValue)

// this function squares a number and returns the new number
const square = (x) => x * x
```

The people who say that comments are bad are thinking of this style of
commenting, and _they'd be absolutely right!_ Comments like this that describe
the "how" of programming add absolutely no value. Each of those comments above
added nothing that couldn't be understood from the code immediately below it.

### Comment the _why_

The problem with the comments above is that they comment the _how._ They
describe the steps we take. Those comments are very rarely useful; code does a
good job at explaining how we do something. After all, lines of code are
instructions to tell the computer how to do something.

Most of the time you'll find that you don't need to leave a myriad of comments
because you can write the code you want to and you don't hit any oddities or
quirks that cause the code to look unusual. But every now and then you'll hit a
situation where you can't write code that's easy to understand. Maybe it's a bug
that you're working around, or maybe it's a legacy system that means you can't
solve the problem how you'd like, or maybe there's just no easy way to make the
code better.

I once worked for a payments processing company and each day a large SQL query
would run to select payments to pay-out. This query was highly optimised (we
needed it to run pretty quickly) and very complex - there were a number of edge
cases to consider. We put a lot of effort into making it as clear as it possibly
could be, but ultimately it would never be easy to understand, there was just
too much code with lots of conditionals and logic that you'd only understand
with certain context about our business and how it ran.

I wanted to find an example that I could show you, so I went diving into the
React codebase to find one. You don't need to be a React developer to follow
along. Here's the code I wanted to highlight:

```jsx
// Currently, key can be spread in as a prop. This causes a potential
// issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
// or <div key="Hi" {...props} /> ). We want to deprecate key spread,
// but as an intermediary step, we will use jsxDEV for everything except
// <div {...props} key="Hi" />, because we aren't currently able to tell if
// key is explicitly declared to be undefined or not.
if (maybeKey !== undefined) {
  key = '' + maybeKey
}
```

([And here's the link to it on GitHub](https://github.com/facebook/react/blob/ddcc69c83b59ef0f895aa5020196e2ae9de36133/packages/react/src/ReactElement.js#L217)).

Notice the code in question:

```jsx
if (maybeKey !== undefined) {
  key = '' + maybeKey
}
```

It's not hard to understand what this code does. If `maybeKey` is not
`undefined`, we set the `key` property to the stringified version of `maybeKey`.

> The string conversion is a little JS trick - `'' + maybeKey` will convert
> `maybeKey` to a string. For example `'' + 2` returns `"2"`.

But here it's all about the _why._ The comment for this code is great. It calls
out the problem, gives two examples and explains the long term plan as well as
the short term solution.

If you're after a comment that I left in code I wrote,
[this comment in some TypeScript => Closure Compiler code](https://source.chromium.org/chromium/chromium/src/+/master:third_party/devtools-frontend/src/scripts/component_bridges/generate_closure.ts;l=60?originalUrl=https:%2F%2Fcs.chromium.org%2F)
is a really good example of the types of comments that I think are super
valuable.

All code can eventually be understood; code is ultimately instructions to the
computer to do something. Code can be confusing but it can't lie, given enough
time any developer can step through code and work out exactly _what it does_.
But it's much harder to work out _why_ it does that. Give your colleagues (or
future you, in six months time) the context behind _why_ the code does what it
does and you'll be much better for it.
