---
permalink: /blog/refactoring-to-remove-passthrough-variables/index.html
title: 'Refactoring to remove passthrough variables'
intro: 'Getting rid of passthrough variables.'
date: 2020-05-19
---

I've been working recently on [Puppeteer] and migrating it to TypeScript. This
has presented the opportunity to do some refactoring and today I want to share a
recent refactoring I did to remove _passthrough variables_.

### What is a passthrough variable?

A passthrough variable is a variable that gets passed through multiple method
calls before it gets given to the actual place in which it's used.

![](/images/passthrough.svg)

Normally these happen either because:

- the object that needs the data is unable to create it
- the object that creates the data (in the above example, `A`), used to need it,
  but now doesn't due to a change in functionality or behaviour.

> Whilst we're not specifically talking about React in this post, you see this
> happen a lot with React props. This is known as
> ["prop drilling"](https://kentcdodds.com/blog/prop-drilling/) and is also
> something you should be wary of.

### Dealing with passthrough variables

It's important to note that passthrough variables are not always avoidable, and
often they are the preferred solution. The fix for passthrough variables can be
simple - moving the creation of the value to the place where it's needed is the
easiest fix - but if you're constrained often the explicitness of passthrough
variables is preferable to any other solution.

Whilst it makes you jump through a hoop or two, the below code is explicit and
does tell the full story about what's happening:

```js
class A {
  constructor() {
    this.value = new SomeValue()
    this.b = new B(this.value)
  }
}

class B {
  constructor(value) {
    this.c = new C(value)
  }
}

class C {
  // somewhere in C we use the value
}
```

It's definitely not the nicest code you've ever seen but it can be methodically
followed. Any solution that creates a method for `C` to access the variable
without the explicitness of passing the values through will introduce some
indirection for a developer to follow. For example, if you chose to put the
value on the global scope (_I do not recommend this, but it's a useful
example!_), you have to figure where that value comes from:

```js
class C {
  doSomething() {
    // woah, where does this come from?!!
    console.log(globalStuff.value)
  }
}
```

Even a more sophisticated approach like React's
[Context API](https://reactjs.org/docs/context.html) still suffers from this
problem. _Often this is a good trade-off and worth taking_ but it's still
something you have to consider. As always in building software there is no
silver bullet!

### Fixing the simple case

Thankfully for me the specific case I was tackling in the [Puppeteer] codebase
was easier to deal with; there was no reason to not create the data in the same
place that it was needed. This is the best fix; taking code that's spread across
three files and moving it into a single file is nearly always an improvement
because it's simply less to keep in your head at any given time.

Taking a look at the
[pull request that made the change](https://github.com/puppeteer/puppeteer/pull/5826/files)
you can see that we came out net-negative in terms of lines of code (not always
the most useful metric but good here) and we simplified classes in the process.
In the case of Puppeteer we had:

- `BrowserContext` create a `TaskQueue` and initialise a `Target class`, passing
  the queue instance.
- The `Target` class took that `TaskQueue` instance and passed it into the
  `Page` constructor.
- The `Page` class made use of the queue instance.

Not only is this very mechanical code to pass all these values through, it's
also polluting multiple classes with knowledge that they don't need. The only
class above that _actually cares_ about a `TaskQueue` is `Page`. But because we
create that value in `BrowserContext` both it and `Target` now have to know
about a task queue and how to pass it around. So not only does this change
remove lines of code, but it reduces the amount of classes that have to know
about the task queue by 66%!

And if that wasn't enough, `BrowserContext` has one fewer instance variable,
`Target` has one fewer instance variable and constructor argument, and `Page`
has one fewer constructor argument to. So this one small PR packs in a good
punch in terms of reducing the complexity of the code.

Keep an eye out for situations like this; they are often left behind as an
accidental by-product of refactorings and they can provide an easy, low risk way
to remove some confusion from your codebase.

[puppeteer]: https://github.com/puppeteer/puppeteer
