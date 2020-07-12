---
permalink: /blog/testing-event-listeners-javascript/index.html
title: 'Testing event listeners in JavaScript'
intro: 'Watch out for this common "gotcha" when testing event listeners.'
date: 2020-07-14
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

Now we avoid having a test that passes and hides an actual bug in our code.

### Solution two: a spy

A `spy` function is one that records every time it's called, and remembers the
arguments it was given, and what value it returned. You can create a spy based
on a real function in your codebase, or you can generate one on the fly to use
in a test. We can create a spy for our event handler, and in our test write code
to assert that it's called with the right arguments. We're going to use Jest's
API to create a spy (Jest calls them "mocks", but they are mostly the same,
don't worry too much about the different terminology). If you're not using Jest
I highly recommend [SinonJS](https://sinonjs.org/releases/v9.0.2/spies/) which
is a great library for creating spies.

We can use `jest.fn()` to create a spy, and pass it in as the event handler:

```js
describe('Page class', () => {
  it('emits an event when a request is started', () => {
    const page = new Page()
    const handler = jest.fn()

    page.on('request_started', handler)
    page.makeRequest('www.foo.com')

    expect(handler).toBeCalledTimes(1)
  })
})
```

Notice our new assertion for this test:

```js
expect(handler).toBeCalledTimes(1)
```

This means our test will fail unless our handler is called exactly one time. You
can use the `toBeCalled()` assertion, and that will pass if the handler is
called one or more times. More often than not I prefer to be strict and use
`toBeCalledTimes(1)`. I want this test to fail if the handler is somehow called
5 times!

With this change we also get a test failure:

```
 FAIL  src/site/code-for-posts/async-tests/async-tests.test.js
  Page class
    ✕ emits an event when a request is started (2 ms)

  ● Page class › emits an event when a request is started

    expect(jest.fn()).toBeCalledTimes(expected)

    Expected number of calls: 1
    Received number of calls: 0

      16 |     page.makeRequest('www.foo.com')
      17 |
      18 |     expect(handler).toBeCalledTimes(1)
         |                     ^
      19 |   })
      20 | })
```

Compare this test failure to the one when we used `expect.assertions`. Notice
that it's more descriptive. The other test failed with a vague message that one
assertion was expected and none were found, whereas this test fails and even
provides a code snippet that points us to the exact line where the failure was.
If you're debugging this test failure, the second error message is more useful
and is likely to point you at the problem sooner.

> You should think about error messages when writing your tests - how can you
> write a test to improve the message shown when the test fails?

There's one more improvement we can make to this test; rather than just ensuring
it's called, we can assert that it's called with the right data:

```js
it('emits an event when a request is started', () => {
  const page = new Page()
  const handler = jest.fn()

  page.on('request_started', handler)
  page.makeRequest('www.foo.com')

  expect(handler).toBeCalledTimes(1)
  expect(handler).toBeCalledWith({
    url: 'www.foo.com',
  })
})
```

This is a thorough test; we ensure it's called once, and with the right
arguments.

### The structure of a test

I have
[blogged before about the structure of the perfect unit test](/blog/the-perfect-javascript-unit-test/)
and the examples today highlight how important that is. A unit test has three
distinct parts to it, in this exact order:

1. **Setup**: prepare any test data
1. **Invoke**: call the code you want to test
1. **Assert**: make assertions on the result

> This is also known as the
> ["AAA pattern": arrange, act, assert](https://www.thephilocoder.com/unit-testing-aaa-pattern/).

If we look at our initial, flawed test that we started with, that does not
follow the three steps:

```js
it('emits an event when a request is started', () => {
  // Setup
  const page = new Page()

  page.on('request_started', (data) => {
    // Assert
    expect(data.url).toEqual('www.foo.com')
  })

  // Invoke
  page.makeRequest('www.foo.com')
})
```

It's in completely the wrong order! It's odd to read; your eyes have to start at
the top, go to the bottom, and then jump right into the middle again.

Even the test that used `expect.assertions()` has the same problems:```js

```js
it('emits an event when a request is started', () => {
  // Setup
  const page = new Page()
  // Assert
  expect.assertions(1)

  page.on('request_started', (data) => {
    // Assert (again)
    expect(data.url).toEqual('www.foo.com')
  })

  // Invoke
  page.makeRequest('www.foo.com')
})
```

It's only the final version of our test that uses spies that has our three steps
in the right order:

```js
it('emits an event when a request is started', () => {
  // Setup
  const page = new Page()
  const handler = jest.fn()

  // Invoke
  page.on('request_started', handler)
  page.makeRequest('www.foo.com')

  // Assert
  expect(handler).toBeCalledTimes(1)
  expect(handler).toBeCalledWith({
    url: 'www.foo.com',
  })
})
```

If a test isn't following these three steps, there's almost certainly an
improvement that can be made to make it adhere to the steps. They've become a
well known pattern for a reason; a test that has these steps in their logical
order is more likely to be a useful, readable test, and as we've seen in this
blog post, give more useful failure messages.
