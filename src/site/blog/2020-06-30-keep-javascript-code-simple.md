---
permalink: /blog/keep-javascript-code-simple/index.html
title: 'Keeping Code Simple'
date: 2020-06-30
intro:
  "Today we're looking at tips to keep code simple and the benefits that it
  brings."
---

When I think about keeping code simple, I think about the progression of your
average software engineer from junior to mid to senior, and this one commonly
mentioned part of that journey:

- **Junior engineer**: writes function implementation over multiple lines,
  favouring simple method calls and comments over succinctness. Probably misses
  some chances to improve the performance or readability, or doesn't use the
  best API method for the task at hand, but the code works.
- **Mid level engineer**: condenses the function down to as few lines as
  possible, using smart coding tricks to reduce lines. Code works, maybe even
  performs faster than the junior's version, but is likely harder to understand
  or modify.
- **Senior engineer**: implements function much more closely to the junior;
  their code is straightforward, uses the right API methods, ensures good
  performance - but doesn't prematurely optimise - and is easy to understand and
  modify.

I've seen this pattern play out multiple times - and I've been each of those
engineers. I remember refactoring some code in a pull request that a junior
developer on our team wrote, thinking I was so smart. I made so many
improvements - and got it down from 10 lines to 4! That's fantastic, I thought.
The change got merged into the code base and not long after it was largely
reverted back to its original state because people needed to work with that
code, and working with such succinct code with so much squashed into just four
lines was nearly impossible. I learned a good lesson that day: **lines of code
are not a good metric of code quality.**

I think about this
[tweet about using reduce by Jake Archibald](https://twitter.com/jaffathecake/status/1213077702300852224)
often:

> All code using `array.reduce` should be rewritten without `array.reduce` so
> it's readable by humans

Whether or not you agree about the specifics of the
[reduce function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
isn't important, but the sentiment behind Jake's tweet is. You're not writing
code to impress your colleagues. The "smartness" of your code doesn't matter.
The readability of your code does. Keep code simple and it will be less effort
to understand, less effort to change, and less frustrating to work with. Traits
of simple code include (but are not limited to) the list below:

- All variables and functions are named based on their behaviour / functionality
  and are easy to follow.
- Any functions in the code take a reasonable amount of arguments; no function
  is so large that it needs five or more arguments to perform its job.
- Appropriate API methods are used for the task at hand and API methods are used
  over custom implementations.
- Using the right data structures to represent your application's data.
- Comments are left if appropriate to add context and convey meaning that can't
  be conveyed via code alone.
- "Smart" shortcuts are not used; you don't have to google the obscurities of
  JavaScript's syntax to understand what the code does.
- Where code perhaps has to be less readable for performance reasons there is a
  comment that explains this and ideally links to a document/email/Slack
  thread/your company's internal wiki that adds context.

If some of those points feel a bit vague, don't worry. It's hard to summarise in
one quick list; we will be diving into each of the topics above in a dedicated
blog post.

Sometimes, code just cannot be made simple. Maybe you're working with a horrible
legacy API whose interface is bizarre in every way possible, or you're stuck on
an old version of a library that you can't upgrade for a variety of reasons.
Most codebases I've worked on have had a rough edge or a dark corner that
developers shy away from. We'll look at techniques to tackle this too and
migrate away from dark dingy corners to codebases and modules that are a
pleasure to work on.

If you've got any questions, comments, feedback, or just want to say hello,
[get in touch with me on Twitter](https://www.twitter.com/Jack_Franklin).
