---
permalink: /blog/the-three-software-developers/index.html
title: 'The three developers'
intro:
  'Thinking about writing better software, not beating yourself up, and learning
  from your mistakes.'
date: 2020-01-27
---

Have you ever come across code that you wrote six months ago and thought "what
was I doing?". I know I have! And I know that in the past I've been too easy to
beat myself about past mistakes instead of reflecting on why the code I wrote
six months ago is now causing me problems.

Worse still I've caught myself criticising _someone else's_ code that they wrote
six months ago. "I can't believe Bob wrote that, what was he thinking?!" is
_not_ a thought that I'm proud of, but it's one that I've had many times.

In the past few years I've spent a large portion of my time tackling large
software migrations; first one from AngularJS to React, and then one from legacy
templating and jQuery to React (turns out I quite like React!). The very nature
of this work means that coming across "bad" code is guaranteed.

### Lacking empathy

A couple of years ago a colleague gave me some candid feedback that they had
noticed that I sometimes spoke quite negatively of the codebase, or work that
had been done a long time ago. This took me by surprise but on reflection was
entirely correct; I was allowing my frustrations to cloud my judgement and
taking that frustration out in meetings on colleagues. This wasn't a good
approach and lead to me coming across as an incredibly unempathetic person to
work with. I don't think this was a true reflection but the way I was thinking
about past code - the "what IDIOT wrote this?!" approach - wasn't healthy for me
or for the team I was on.

After some reflection I realised that I was thinking about my past coding
efforts (or that of my colleagues) all wrong; rather than criticising and
assuming bad decisions, I should think back to what I knew _at the time of
making the decision_ and what I _now know, at the time of criticising that prior
decision_. When thinking about that code I wrote six months ago along with _the
context in which it was written_ it became clear that it wasn't an idiotic or
bad decision, but a reasonable one at the time. This was a big shift in my
thinking but one that lead me to a greater understanding of how we make
decisions when programming and how I should always assume good intentions given
the context of the decision.

### Context matters in code

As a concrete example, I came across some code that short circuited various
conditionals given a certain value, and it stuck out as different to all the
code surrounding it and I couldn't figure out why it needed to short circuit in
the way it did. I did some digging, asked around, and got a solid explanation
that it had been an urgent bug fix on a Friday afternoon to fix an issue with
some bad historical data that had suddenly revealed itself. Suddenly it became
clear; the developer who wrote that code wasn't bad, they hadn't purposefully
written bad code, they had made a reasonable decision to deploy this change to
fix a bug before everyone headed home for the weekend.

### The three developers

Knowing that decisions that seemed reasonable at the time can end up being
sub-optimal, and that we can never predict the future of how our software will
need to change, lead me to what I've found a very clear, productive way of
thinking where I don't blame myself (or others) for past mistakes and instead
place emphasis on what _I can learn_ rather than _who I can blame_.

So when I'm writing code now I think of three developers:

- _Past Jack_
- _Current Jack_
- _Future Jack_

And whilst I am thinking about myself as the person who wrote, or is writing,
the code, this applies to all members of the team or anyone who could encounter
or interact with code I write.

### Past Jack

I used to think that Past Jack made loads of stupid mistakes, wrote poor
decisions and generally left code in a bad state. But now I trust that Past Jack
made those decisions with the best intentions, using the knowledge he had to
inform the decision as best he could. I like to think about what I can learn
from Past Jack; how I can see now that the code he wrote six months ago wasn't
the best solution in the long run, and how that can inform the decisions that I
make today - which brings me nicely to the next developer.

### Current Jack

Current Jack (or, me - I get this is a bit weird to talk about myself in the
third person 😂) likes to take lessons learned from past code and try to avoid
those problems in the future. It's great to be able to look back at code that
was written three, six, twelve months ago and decide what's causing issues, what
isn't clear, and how the code could have been clearer.

> Writing code that computers understand is easy, but writing code that humans
> can understand is the challenge.

Developers spend more time reading existing code and modifying it rather than
writing brand new code from scratch so being able to take code that you (or a
colleague) wrote six months ago and get it into your head quickly is a major
productivity boost during your day.

### Future Jack

Future Jack is always in my mind when I'm writing code because I want to give
him that productivity boost, whether that's in the form of clear code that's
easy to follow (I hope so), or a good set of unit tests that clearly document
all the expected behaviour so it's easy to refactor later, or if that's a
massive code comment explaining some odd edge case that's impossible to solve
nicely. Future Jack will be the person loading up a file to fix a bug that's
causing downtime and will be in a rush to understand and fix the problem as
quickly as possible and anything I can do now to make Future Jack's job easier -
whilst learning from Past Jack's decisions - is worth doing.

### We're all learning

One of my favourite things about being a software engineer is that it's never
finished. There is never a perfect approach that applies equally to every type
of problem, or a particular framework that solves every issue any developer will
ever have. We're all learning, making mistakes, fixing them, and trying to make
life just a little bit easier for our future selves or colleagues.
