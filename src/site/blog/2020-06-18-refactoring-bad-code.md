---
permalink: /blog/refactoring-javascript-code-with-tests/index.html
title: 'Refactoring JavaScript with tests'
intro:
  'Continuing on from the last post where we wrote tests for our bad code, today
  we are taking on some refactoring work.'
date: 2020-06-18
---

In
[the last post we tackled writing tests for bad JavaScript code](/blog/writing-tests-for-bad-javascript-code/index.html)
and now we have tests covering the behaviour of our code we are ready to do some
refactoring and improve the code to make it easier to work with.

The code at hand generates filenames for media associated with a book. Here's
one of the tests to jog your memory:

```js
const fileName = Publisher.generateFilename({
  publishOn: new Date(2021, 3, 1),
  categoryPrefix: 'tech',
  kind: 'software-design',
  id: 123,
  title: 'Software Design',
})
expect(fileName).toMatch(/2021-4techsoftware-design123[0-9]{5}-softwared\.jpg/)
```

What motivated this refactoring is that we've been asked by our manager to make
a change to this output. Each individual section in the filename should be
separated by a dash (`-`). In the above output you can see that this happens
inconsistently on different parts of the output. Right now this would be a very
manual bit of work to take all the string concatenation and add dashes. Let's
see if we can follow [Kent Beck](https://twitter.com/KentBeck)'s advice and do
our work as two separate steps:

1. Do the work to make the change easy (note: this may be hard).
2. Do the easy change.

> It's a common misconception that you need to carve out explicit time to
> refactor code; instead try to think of refactoring as work to be done to make
> a new feature easier and quicker to implement. That's also much easier to
> convey to stakeholders!

### Making the change easy

If we think of the filename as a series of parts then we can start to make
progress. We know that we have the tests to confirm that everything is working,
and our goal now is to make a series of changes to improve the code. Our steps
should be small, and we should run the tests after every change. We want to know
ASAP if we've broken anything!

> Have you ever broken your app and frantically started undoing things to try to
> get back to a state where it was working? Or been midway through a refactor
> and had loads of broken tests? Try to get into the habit of making small
> changes and running your tests _after every one_ to help you become aware of
> any issues the moment they crop up. It's much easier to undo immediately
> rather than backtrack through changes.

```js
class Publisher {
  static generateFilename(target) {
    let fileName = `${target.publishOn.getFullYear()}-${
      target.publishOn.getMonth() + 1
    }`
    // more code here
  }
}
```

The first change I'm going to do is to split each part of the filename
generation into its own function. Let's take that first part and pull it into a
function:

<side-by-side first="Svelte" second="React">

```js
const publishDatePart = (target) => {
  return `${target.publishOn.getFullYear()}-${target.publishOn.getMonth() + 1}`
```

```js
const publishDatePart = (target) => {
 return `SECOND`;
```

</side-by-side>

And then call it:

```js
class Publisher {
  static generateFilename(target) {
    let fileName = publishDatePart(target)
    // more code here
  }
}
```

Running the tests confirms we've not broken anything. Another good guiding
principle here is that when refactoring, you should be able to stop and have
left the code in a better place than when you found it. Although it's only a
small step, it's easier to figure out and deal with this code now it's pulled a
little bit apart, so we've made an improvement.

### Pulling out all the functions

I'll spare you the details of each function but this is what we're left with
after taking the step above multiple times:

```js
class Publisher {
  static generateFilename(target) {
    let fileName = publishDatePart(target)

    fileName += target.categoryPrefix
    fileName += kindPart(target)

    fileName += String(target.id)
    fileName += randomPart()
    fileName += target.isPersonal ? target.ageRange : ''

    fileName += titlePart(target)
    fileName += '.jpg'

    return fileName
  }
}

const titlePart = (target) => {
  let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
  let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
  return `-${truncatedTitle.slice(0, truncateTo)}`
}

const randomPart = () => {
  return Array.from({ length: 5 }, (_) => Math.floor(Math.random() * 10)).join(
    ''
  )
}
const kindPart = (target) => {
  return target.kind.replace('_', '')
}

const publishDatePart = (target) => {
  return `${target.publishOn.getFullYear()}-${target.publishOn.getMonth() + 1}`
}
```

It's really important during this part of work that you resist the urge to
change any of the code. The bodies of the functions are exactly as they were
before; I've just extracted them into functions. Some of them we might not even
get to refactoring today; but that's OK, we're still making great progress and
the code is far more approachable for the next time we come to work on it. And
more importantly, we're now ready to make our feature change!

### Making a feature change

I like to be driven by tests, so knowing that we're going to have more dashes in
the output than we do currently, let's go through each test and update it so
they have dashes in the places we expect. Here's one example:

```js
it('removes other special characters from the book title', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'biography',
    id: 123,
    title: '(My) <title$>',
  })
  expect(fileName).toMatch(/2021-4-bio-biography-123-[0-9]{5}-mytitle\.jpg/)
})
```

If we run the tests now, all seven are failing! Let's see if we can get them
back to passing. If you find this overwhelming, often I'll pick just one single
test (in Jest you can change an `it` to `it.only` and have only that test run).
This way you don't have a huge output and once you have one test passing you can
run the rest.

The first thing we'll do is go through each individual part and remove any
dashes that are currently output. This way we'll make them all uniform - no
individual part will be responsible for adding dashes. Then we can easily make
it so we take all the parts and combine them with a dash. As it happens we only
have to do this to `titlePart`, where we can lose the string interpolation
return just the title part:

```js
const titlePart = (target) => {
  let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
  let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
  return truncatedTitle.slice(0, truncateTo)
}
```

Now we can make the easy change to get us back to green. Let's create an array
for all the book's parts and join those together with a dash as the joining
character:

```js
class Publisher {
  static generateFilename(target) {
    const parts = [
      publishDatePart(target),
      target.categoryPrefix,
      kindPart(target),
      String(target.id),
      randomPart(),
      target.isPersonal ? target.ageRange : '',
      titlePart(target),
    ].filter(Boolean)

    const extension = '.jpg'
    return parts.join('-') + extension
  }
}
```

There's one slight "gotcha" that I miss the first time; without the
`filter(Boolean)` we include the empty string should `target.isPersonal` be
`false`, which means we end up joining the empty string with dashes and get
doubles. But once we spot that, we're green again and have our feature
implemented.

### Conclusion

There's much more we could do here; the code is by no means perfect. But it is
much cleaner than it was, it's got a comprehensive suite of tests, and by
pulling out its functionality into smaller methods we have put in place the
foundations to further iterate on this code when we next need to add a feature.
That extra time spent writing tests has paid off now, and it will continue to
pay off time and time again whenever we revisit this part of the codebase.
