---
permalink: /blog/letting-tools-make-choices/index.html
title: 'Letting tools make choices'
intro:
  "A post about letting tools make choices and do the work to leave you free to
  focus on what's truly important."
date: 2020-01-15
---

In my
[first post of the year about technical choices I'm making in 2020](/blog/frontend-javascript-choices/)
I finished with a point about letting tools make choices for you:

> I've become a fan of putting more of that burden onto the technologies I'm
> chosing such that I can focus in on the actual application. I would be
> surprised if the tools that catch my eye in 2020 aren't ones that follow this
> pattern.

This has been a trend for me and my work over the last year or so and I wanted
to use this post to expand on it.

### Holding onto control

I would never have written a post like this a few years ago. One of my main
decisions when deciding what tools to use was how much control I had over the
entire surface area of the tool and just how much I could customise it to my
every desire.

My logic at the time was that if I could configure my environment and tools to
_precisely_ what I wanted, I would create this zen like application that was set
up to enable me to be the most productive I could be.

### Time spent configuring

My approach wasn't correct because of two things that are true of all software:

1. Software is never finished.
2. Software is never perfect.

That is to say I could never get to this perfect setup of tools because there
would _always_ be something left to do! Anyone who has worked on an engineering
team knows this; teams create sprint boards and backlogs and those backlogs
inevitably end up with far more items in than your team could ever achieve. I
remember sitting down one evening after work to focus on a side project and
losing the best part of the evening trying to get two different tools that I'd
chosen to use playing nicely alongside each other. I finished for the night and
realised that I'd made _no progress_. I didn't even need those tools to work
together to allow me to make progress, but I was so concerned about having the
perfect setup that I forgot about building the actual application.

Once I had everything playing nicely, one of the tools would have an update
which broke something and I'd repeat the process all over again.

Shockingly, that project never saw the light of day (and there are many more
like it).

### Losing hours to extreme ESLint configuration

The amount I valued control really became apparent on another side project where
I probably spent the first two hours _just configuring ESLint_. I can't tell you
how long I debated in my head between Style A or B, all while having no actual
project code and basing my decision off dummy code I was writing to test my
ESLint setup!

At this point as well I was _the only developer_, so why it really mattered to
me that I stuck to an incredibly strict set of rules I'm not quite sure. Yet
again I'd scuppered a side project before it had even started.

> I still use and value ESLint in my toolchain but apply far fewer rules than in
> the past.

### Working on a team

When I got my first professional job out of university I joined a team who
already had a set of conventions for their code that newer members of the team
were expected to stick to (although we had a good culture where anyone could
suggest changes/new additions). It shocked me _how much I struggled with this_!
I would sit at my desk not wanting to write code or even trying to avoid certain
language features because it would frustrate me to do it "wrong". Looking back
on this it's very embarrassing to admit and silly that I got hung up on it.

### Deciding what to work on

Once I'd worked in an engineering team for over half a year it dawned on me that
every person in every team has far more they'd like to do than they can actually
do. Regardless of company size, team size, an individual's role or experience,
there is simply too much to do.

Once I realised this I began to think about what I value most and what I want to
spend my time doing. At work, I like building things that people use. I like
finishing off a nice UI to help users with a particular problem. I like building
tools that other engineers use that helps them be more productive. I like
improving our acceptance tests after a bug makes it into production so it can't
happen again. That's what I like doing and it's how I have the most impact on
the company, my team, and the people who are using the products we build.

I decided that any work that takes me away from the core of my job and what I
like doing was not worth dedicating multiple hours to. I still care about it and
still work in this area (as I said above, we use ESLint at work to help us) but
I spend far less time than before. On side projects I'll tend to chuck
[my favourite ESLint config](https://github.com/suchipi/eslint-config-unobtrusive)
in and be done with it so I can focus on the actual project itself.

### Tools that make decisions make me more productive

The best example of a tool that I've come to love is
[Prettier](https://prettier.io/). It's far from the first code formatting tool
out there but it popularised the idea of automatic code formatting for frontend
development. Suddenly I went from strictly controlling all aspects of my code
formatting via thousands of ESLint rules to having one tool that made a set of
choices that _I couldn't change even if I wanted to_! Prettier is opinionated
and it's what I love the most. I install it, set it running and it formats my
code how it thinks it should be formatted and that's that. I don't like every
decision Prettier makes with code, but I like that its made that decision for
me.

The trend of _zero config_ tools was perhaps overhyped slightly - there will
always be projects with edge cases and certain situations that rely on full
customisation and control - but tools that lean towards being less configurable
have tended to find their way into my toolbox.

For small side projects these days I'll often reach for
[Parcel](https://parceljs.org/) as an out of the box bundler because it just
handles anything I throw at it without much effort, and it's not surprise that
[Jest](https://jestjs.io/) has become my testing framework of choice for the
same reason.

### Tools that make decisions help beginners get up and running

Preferring tools that make decisions is why I'll push people towards
[create-react-app](https://github.com/facebook/create-react-app) if they want to
learn React but aren't sure where to start. I've seen many people try and fail
to learn React not because they aren't capable of learning React but they give
themselves a huge mountain to climb and try to learn React, Webpack, Babel, and
more _all at the same time!_

If you're teaching beginners, or working with junior developers, encourage them
to focus on the job in hand and what's really important and let tools fill in
the gaps.

There's nothing wrong with someone being comfortable with React and deciding
that they would like to learn what create-react-app does under the hood, or
spending a weekend building their own rough version of React to gain a greater
understanding of the tool. But when you're just getting started it's important
to focus in on what's really important. Anything else can be deferred.

### Clearing your head and focusing

Another benefit I've experienced is that once you offload decisions to tools
you're able to think more clearly about the problem at hand. That applies to
beginners trying to learn something new, but it applies to starting a side
project and working on what's really important.

I encourage you to think about this next time you load up a project at work, or
at home. Where are you spending time and energy that you can offload to
something else, freeing you up to do your best work?
