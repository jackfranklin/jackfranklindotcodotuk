---
permalink: blog/who-pays-for-the-tokens/index.html
title: 'AI loops: who pays for the tokens?'
date: 2026-06-28
---

A recent trend in AI has become this idea of "loops". Rather than you doing
prompting and working with the AI to design and implement, you instead give it a
higher level goal and let it roll. You build a system to let the AI make
decisions, build and verify its work, all with the aim of completing your goal.

As [Addy Osmani puts it](https://addyosmani.com/blog/loop-engineering/):

> A loop here can be thought of a recursive goal where you define a purpose and
> the AI iterates until complete.

This has been an approach pushed by
[Peter Steinberger (OpenClaw, OpenAI)](https://x.com/steipete/status/2063697162748260627)
and
[Boris Cherny (Claude Code, Anthropic)](https://www.businessinsider.com/what-are-loops-ai-engineering-tips-2026-6).

Regardless of if you agree or disagree with this particular approach, I wanted
to write about this and how **when it comes to AI, you must consider the context
of who is giving you advice** because a person's circumstances can make a huge
difference to how they encourage AI usage.

## A disclaimer: I am one of these people!

It would be unfair of me to not point out that I am probably a person with an
opinion on AI you should be wary of because:

1. I work at Google, I am encouraged to adopt AI in my workflow, and I do not
   pay for any tokens or have any limits on token consumption (at least to a
   practical level).
2. I work on AI features in Chrome Tooling; my job is to help people achieve
   more with the help of AI.

Please have this in mind as you read this article - but also remember that this
blog post and all others on this site are solely my personal opinion.

## It's easy to spend money when using AI

Outside of work - where I do not get any discount/free plans for Google models -
I was experimenting with a few "pay as you go" agents and mistakenly for one
agent I provided payment details and forgot to set an upper limit on spend. I
set out to use AI to help rework CSS in my side project; the CSS was a mess and
I wanted to move to a system of variables and defined colours so I could easily
support light and dark mode in the future. This was work that was valuable, but
not critical or important to get done in one go.

By the end of my prompting and usage, I had spent **\$105.92**, only to end up
with some CSS that was better structured and used CSS variables. I'm fortunate
that I could afford that money (although not on a regular basis!) but there was
no doubt in my mind that it was not money well spent.

Loop engineering, applied naively with a pay-as-you-go model, is exactly how
you end up in situations like mine. I want more people to talk about this,
particularly when it comes to having people experiment with AI. There is now a huge pressure to adapt and use AI for
software (at work and on side projects) but there is a real financial cost to it
that not everyone can (or should) pay. Which is why I think it's important to
think critically about all advice on AI usage, especially from those in a
privileged position who don't have to think about this.

## Loop engineering: whose interest does it serve?

AI providers have been pushing the idea of longer running, more complex tasks -
ones that ultimately consume far more tokens and money.

It's hard to not think that this is related to recent news on AI usage:

1. AI providers have
   [removed subsidised subscription pricing](https://jenstirrup.com/2026/05/25/the-ai-subsidy-era-is-over-cfo-mistakes/)
   to try and improve revenue.
2. The
   [Uber COO](https://fortune.com/2026/05/26/uber-coo-ai-spending-tokens-claude-code/)
   has said they are considering AI usage and how best to track ROI.
3. More generally,
   [more companies are reducing spending or at least becoming much more careful with spend](https://www.buildmvpfast.com/blog/companies-removing-ai-cutting-costs-uber-microsoft-google-2026)
   as usage grows across their organisations.

These articles, combined with the sudden narrative of "loop engineering" has
understandably been
[met with scepticism](https://bsky.app/profile/carnage4life.bsky.social/post/3mp5arv6m422d)
as a ploy to have folks care less about short-term AI accuracy. Instead of
optimising for AI success and low iterations, loop engineering encourages the
developer to think at a higher level and be less concerned with how many steps
and tokens it takes to get there.

## Caring (or not) about value for tokens

In my day to day job at Google I consistently use
[Antigravity CLI](https://antigravity.google/product/antigravity-cli) on a daily
basis and I am confident it boosts my productivity and output. I've used it to
debug issues that I spent hours failing to reproduce by hand, and last week it
helped me make a C++ change to the Chromium codebase that - whilst not complex -
would have taken me (as a beginner in the language) much longer to put together.

But, it is **easy for me to be so positive about AI in this context** because I
do not see the cost. My AI usage at work is effectively free. **I do not care
how many tokens I use to get something done**. Of course, I want to optimise for
time and efficiency, but I'm not watching the tokens. Outside of the largest
companies and the model providers, I doubt anyone else is able to be quite so
relaxed about it.

But, outside of work, I pay personally for my AI usage. For the past year or
so I've used Claude Code for my side projects (I did this well before Google had
a CLI tool, and even if I did use Google tools for personal work, I would not
receive any discount or extra tokens). Paying for the Claude Pro plan means I
don't worry about spend as much - but I do have to accept sometimes that I'm out
of tokens! - but it does mean I'm considered in how I use it, and when I use it.
I will often avoid using it for menial tasks where the time saving is not worth
it.

## Read widely, think critically

I encourage you to read a spectrum of opinions about AI in software engineering
(and beyond). Although I am wary of advice from folks who don't pay for tokens,
that doesn't mean I ignore them. Their opinions are interesting and I learn a
lot from them. I also read from folks who are as strongly against AI as you can
get, and everything in between.

Whatever advice you read, and whatever your personal take on AI and how much you
want to use it, **be mindful of where the advice comes from** and always **come
to your own conclusions**, free from **any pressure to spend money on tokens to
"keep up"** with the industry.
