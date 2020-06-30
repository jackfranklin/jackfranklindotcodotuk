---
permalink: /blog/testing-event-listeners-javascript/index.html
title: 'Testing event listeners in JavaScript'
intro: 'Watch out for this common "gotcha" when testing event listeners.'
date: 2020-07-10
---

Testing JavaScript code that's asynchronous can prevent its own set of
challenges that you have to ensure you deal with when writing your tests.

I recently came across a test that fell foul to the asynchronous code it was
trying to test and in this post I'll show you how to look out for these tests
and how to fix it.

### The problem

Let's imagine we're working on an API that lets you make requests to load pages
in a web browser. We have a `Page` class that provides the `makeRequest` method
that will emit a `request_started` event:

```js
const EventEmitter = require('events')

class Page extends EventEmitter {
  makeRequest(url) {
    this.emit('request_started', { url })
  }
}
```

This means any other part of this codebase can listen out for these events:

```js
page.on('request_started', () => {
  /* do something here */
})
```

This is useful functionality, so let's write a test for it:

```js
describe('Page class', () => {
  it('emits an event when a request is started', () => {
    const page = new Page()

    page.on('request_started', (data) => {
      expect(data.url).toEqual('www.foo.com')
    })

    page.makeRequest('www.foo.com')
  })
})
```

This test passes, but it's hiding a problem. What happens if we deliberately
break it? If we remove the `this.emit` line, look what the test outputs:

```
PASS  src/site/code-for-posts/async-tests/async-tests.test.js
 Page class
   ✓ emits an event when a request is started (6 ms)
```

This is less good 😒. But why does it pass?

If we take a look at the test body, think about what happens when the
`request_started` event never fires. Which of the lines below will end up being
executed?

```js
it('emits an event when a request is started', () => {
  const page = new Page()

  page.on('request_started', (data) => {
    expect(data.url).toEqual('www.foo.com')
  })

  page.makeRequest('www.foo.com')
})
```

Because our `expect` call is within the event listener callback, it never runs
if the event never fires! This is problematic because most test frameworks
assume a test that doesn't explicitly fail is passing. Most test frameworks
won't notify you if your test never actually makes an assertion.

> You can catch these tests earlier by following this habit: when you write a
> test and it passes, **deliberately try to make it fail**. When you write a new
> test, **see it fail at least once** to have confidence that you're testing the
> right thing.

Luckily there's a couple of ways we can fix this test.

### Solution one: `expect.assertions`

If we're using Jest, we have access to
[`expect.assertions` and `expect.hasAssertions`](https://jestjs.io/docs/en/expect.html#expectassertionsnumber).
These tell Jest to fail the test if there are not the amount of assertions
you're expected, which is a great way to catch the case where you have an
asynchronous assertion that doesn't run. If we update this test and let it fail
we can see the output and now the test is failing, catching the issue with the
implementation code.

```js
it('emits an event when a request is started', () => {
  const page = new Page()
  expect.assertions(1)

  page.on('request_started', (data) => {
    expect(data.url).toEqual('www.foo.com')
  })

  page.makeRequest('www.foo.com')
})
```

And Jest will let us know that there were no assertions:

```
FAIL  src/site/code-for-posts/async-tests/async-tests.test.js
Page class
  ✕ emits an event when a request is started (2 ms)

● Page class › emits an event when a request is started

  expect.assertions(1)

  Expected one assertion to be called but received zero assertion calls.
```
