---
permalink: /blog/writing-tests-for-bad-javascript-code/index.html
title: 'Writing tests for bad JavaScript code'
intro:
  'A post documenting how to approach testing some code that you can barely make
  sense of.'
date: 2020-05-26
---

I like refactoring code and thinking about software design. It's something I
speak about, blog about and enjoy doing as part of my job day to day. A core
part of any refactoring is knowing that you haven't broken any functionality and
the best way to have confidence in that is by having a set of tests you can run
to ensure you've not broken anything.

But what do you do when there are no tests? You should never dive into a
refactoring without tests, but how do you ensure that you've got good tests?
Today we're going to look at some code we've stumbled across and want to
refactor, and how we first take the step of adding tests.

> The example code below is taken from a _fantastic_ talk by Katrina Owen titled
> ["Therapeutic Refactoring"](https://www.youtube.com/watch?v=J4dlF0kcThQ) which
> I highly recommend. It's such a good example that I've adapted it to
> JavaScript to use for this blog post.

### The code: generating filenames for books

Here's the code we've been asked to work with. We're working at a publishers and
this code generates the filename for the front cover of a given book (or
_target_). There's some features we need to add to this code, but for now we
just need to understand it. Feel free to take a moment to give it a read.

```js
class Publisher {
  static generateFilename(target) {
    let fileName = `${target.publishOn.getFullYear()}-${target.publishOn.getMonth() +
      1}`

    fileName += target.categoryPrefix
    fileName += target.kind.replace('_', '')
    fileName += String(target.id)
    fileName += Array.from({ length: 5 }, _ =>
      Math.floor(Math.random() * Math.floor(10))
    ).join('')

    let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
    let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
    fileName += `-${truncatedTitle.slice(0, truncateTo)}`
    fileName += '.jpg'

    return fileName
  }
}
```

There's a lot going on here! It looks like we generate the name based on the
published date, the category, the type of book, some random digits, and then the
title which we truncate if needed. It's clear that this code could do with some
attention; it's not the easiest to read or follow. The first step is to try and
clarify all the behaviour that we have so we can test it. But right now we don't
have a single test! So let's attempt to write one.

### Writing our first test

I've spoken before about descriptive tests, but in this case we don't even know
what we're testing! In this case I like to start really basic and just prove to
myself that this code even works:

```js
describe('Publisher', () => {
  it('does a thing', () => {})
})
```

We know that `generateFilename` takes a target, so we can try to make a fake
target as best we can. If we mess it up, we'll get errors from the tests telling
us what we missed.

```js
describe('Publisher', () => {
  it('does a thing', () => {
    const fileName = Publisher.generateFilename({
      publishOn: new Date(2021, 3, 1),
      categoryPrefix: 'tech',
      kind: 'software-design',
      id: 123,
      title: 'Software Design',
    })

    expect(fileName).toEqual('???')
  })
})
```

But what about the assertion? We have no idea what the output will be. In this
case I like to write an obviously wrong output and watch the test fail. The
failure will show us what we're actually expecting!

```bash
Expected: "???"
Received: "2021-4techsoftware-design12358113-softwared.jpg"
```

OK, so let's drop that name into our assertion and hopefully the test should
pass. Well unfortunately:

```bash
Expected: "2021-4techsoftware-design12358113-softwared.jpg"
Received: "2021-4techsoftware-design12369199-softwared.jpg"
```

Random numbers like this can derail a test, but thankfully there's a workaround.
We can expect our output to match a regex where we hardcode everything bar the 5
digits that are random:

```js
expect(fileName).toMatch(/2021-4techsoftware-design123[0-9]{5}-softwared\.jpg/)
```

And now we are passing! Phew. Whilst this felt like a bit of a slog we're now in
a great position. We have at least one test, and now we're ready to figure out
the other set of tests that we'll need.

### Finding branches in the code
