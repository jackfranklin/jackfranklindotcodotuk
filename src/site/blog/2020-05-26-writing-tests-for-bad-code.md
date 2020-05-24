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
      Math.floor(Math.random() * 10);
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

When you're trying to write test cases that flush out all the possible edge
cases you should look for conditionals in the code. These are effectively all
the branches that you're trying to test. Each `if` becomes two test cases: one
that tests the positive side and one for the negative side.

The first conditional we hit adds the `ageRange` to the file name if the book is
personal:

```js
fileName += target.isPersonal ? target.ageRange : ''
```

Our first test case didn't include this, so let's make sure we test this and
include the age range in the assertion:

```js
it('includes the age range if the book is personal', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    ageRange: 10,
    isPersonal: true,
    categoryPrefix: 'kids',
    kind: 'childrens-book',
    id: 123,
    title: 'Five go on an Adventure',
  })
  expect(fileName).toMatch(
    /2021-4kidschildrens-book123[0-9]{5}10-fivegoona\.jpg/
  )
})
```

The next conditional is the truncation:

```js
let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
let truncateTo = truncatedTitle.length > 9 ? 9 : truncatedTitle.length
fileName += `-${truncatedTitle.slice(0, truncateTo)}`
```

Our first test case used the title 'Software Design' which is greater than 9
characters long, so this behaviour is being tested already. So let's add another
test case that uses a really short title and confirms it does not get truncated.

```js
it('does not truncate titles less than 9 characters long', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'biography',
    id: 123,
    title: 'Jack',
  })
  expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-jack\.jpg/)
})
```

> There's other behaviour here yet to be tested - that regex in particular looks
> interesting - but right now we are only after branches.

Those are all the conditionals that we've come across so let's have a look at
where we're up to with our tests:

```js
describe('Publisher', () => {
  it('does a thing', () => {})

  it('includes the age range if the book is personal', () => {})

  it('does not truncate titles less than 9 characters long', () => {});
```

We can now rename the `'it does a thing'` test; that test actually tests that
truncation works with titles greater than 9 characters long. Notice how we
didn't know that at the time but we do now. Let's update it's description
accordingly:

```js
it('truncates titles greater than 9 characters long', () => {
```

Now we have three passing tests and our conditionals dealt with, let's look at
other edge cases or particularly interesting bits of behaviour that we'd like to
test.

### Looking for other edge cases and changes in behaviour

Now we're scanning the code looking for things that we'd like to test. And we
hit a good candidate on line 1; including the year and month in the output. What
we now have to consider is is this worth writing a specific test for, or are the
current suite of tests sufficient? This is where some personal preference comes
in; I'd argue that every test will test this date logic, as it's not conditional
on anything else, so we can leave this be.

```js
fileName += target.kind.replace('_', '')
```

This is the first line that makes me want to write a test. If the `kind` has an
underscore in, it will be removed. We also hit a curious issue here: what if
there are multiple underscores? This code will only replace the first instance,
not all of them. This would be the sort of thing I'd note down for later; to
check if this is desired or a bug in the implementation. **When you're writing
tests for code you don't understand, don't fix anything at first. Get good test
coverage and note down any potential bugs you find along the way**.

Here I make sure I write a test where `kind` has an underscore and assert that
it's been removed in the output. I then also write a test that confirms if there
are multiple underscores only the first is removed, because I'd like to document
that behaviour even if we then ultimately decide that it's a bug (at which point
we can update the test).

```js
it('removes the first underscore from the kind', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'self_biography',
    id: 123,
    title: 'Title',
  })
  expect(fileName).toMatch(/2021-4bioselfbiography123[0-9]{5}-title\.jpg/)
})

it('does not remove any subsequent underscores from the kind', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'self_bio_graphy',
    id: 123,
    title: 'Title',
  })
  expect(fileName).toMatch(/2021-4bioselfbio_graphy123[0-9]{5}-title\.jpg/)
})
```

The next thing that strikes me is this line:

```js
let truncatedTitle = target.title.replace(/[^\[a-z\]]/gi, '').toLowerCase()
```

Or specifically, _this regex_:

```js
[^\[a-z\]]/gi
```

This regex (we think) is supposed to match anything that isn't a letter. In the
code anything that matches is replaced by nothing, and we note that the `/gi`
makes it global (every match will be replaced) and case insensitive. But what's
curious here is that the inner braces are escaped:

```bash
\[a-z\]
```

So this regex also looks like it will leave any braces in the title. This _seems
unlikely_ so we note this as a potential bug, but given it is coded behaviour,
let's write a test to prove that braces do remain. We'll also write another test
that has a funky title full of special characters to ensure they get removed:

```js
it('does not remove braces or letters from the book title', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'biography',
    id: 123,
    title: 'My [Title]',
  })
  expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-my\[title\]\.jpg/)
})

it('removes other special characters from the book title', () => {
  const fileName = Publisher.generateFilename({
    publishOn: new Date(2021, 3, 1),
    categoryPrefix: 'bio',
    kind: 'biography',
    id: 123,
    title: '(My) <title$>',
  })
  expect(fileName).toMatch(/2021-4biobiography123[0-9]{5}-mytitle\.jpg/)
})
```

And that's the last part of behaviour that leaps out at us as worth testing.

### Conclusion

With that we now have 7 tests that describe and specify the functionality that
`generateFilename` gives us:

```js
it('truncates titles greater than 9 characters long', () => {})
it('includes the age range if the book is personal', () => {})
it('does not truncate titles less than 9 characters long', () => {})
it('removes the first underscore from the kind', () => {})
it('does not remove any subsequent underscores from the kind', () => {})
it('does not remove braces or letters from the book title', () => {})
it('removes other special characters from the book title', () => {})
```

We also think we might have found some bugs along the way:

- Is it deliberate that only the first `_` gets removed from the `kind` of the
  `target`?
- Similarly, are braces meant to be included as part of the title's output? Or
  is that a typo when defining the regex?

GitHub: TODOJACK
