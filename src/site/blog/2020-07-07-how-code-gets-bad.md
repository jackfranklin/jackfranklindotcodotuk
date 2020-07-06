---
permalink: /blog/how-javascript-code-gets-bad/index.html
title: 'How code gets bad'
date: 2020-07-07
intro: "Before we can begin to fix our code, we must first understand how code
gets bad."

---

We've all been there. The one corner (or maybe there's multiple!) of your
application that makes you cringe every time you have to touch that part of the
code. The proposed feature that you hope doesn't make it into the prioritised
list of work because implementing it means diving deep into the guts of the
nasty corner of your codebase that is hard if not impossible to work on with
confidence.

At one company I worked at I had a very frustrated product manager exclaim
"Jack, it feels like whenever I propose a new feature on [site area X], you tell
me it can't be done". The unfortunate truth was that it couldn't; that area of
the site functioned just fine but no one could tell you how or work on it
confidently without causing other bugs. The problem with areas of the site like
this is that they only get worse once they start deteriorating into what I like
to call "quick hack territory" which normally goes something like this:

1. An event happens that causes knowledge and confidence of a feature to be
   lost; this could be the developer who built it moving on, a huge quick
   rewrite to meet a rushed deadline, or a 3rd party dependency becoming
   unmaintained.
2. The next developer who has to work on that part of the codebase doesn't have
   a solid knowledge, or they are up against a tight deadline, so they rush and
   "hack" their change into place. They mean to come back to it later - as we
   all do - but other work gets in the way.
3. The next person who touches this area sees the previous person hacked their
   way to success and either:
   1. decides this code is in need of some attention to get it back to a
      satisfactory standard
   2. decides that time pressures are too great and they hack their feature in
      too
4. Rinse and repeat - but every time you don't give the code the attention it
   needs, you're making it worse.

I want to be very clear: I'm not criticising any of the hypothetical developers
above who made that decision to get their feature out no matter the cost. We
have all been there, whether the pressures be deadlines, start-up fundraising
rounds, a big company event where the latest features have to have landed, and
so on. Sometimes taking the short-cut and sacrificing some code quality is the
right decision and sometimes it simply has to be done for the business.

What we'll spend a lot of time in this series of blog posts talking about is not
only what makes good code, but how to turn bad code into good code in an
incremental way, a path of small improvements that transform your bad corners
into glorious palaces (I'm stretching this analogy but roll with me!) that you
look forward to working on. **Big bang rewrites are not the way forward and
should be a last resort.** They are expensive, full of risk and deliver no value
until the day comes to release them. Instead we can use a variety of techniques
to migrate from within, starting small and growing with every deploy. This is a
technique I've used many times and whilst it can be slow and frustrating at
times it's also a reliable way to improve your system bit by bit whilst keeping
risk low and ultimately your users and stakeholders happy as you replace the
engine as the car runs smoothly.

If you've got any questions, comments, feedback, or just want to say hello,
[get in touch with me on Twitter](https://www.twitter.com/Jack_Franklin).
