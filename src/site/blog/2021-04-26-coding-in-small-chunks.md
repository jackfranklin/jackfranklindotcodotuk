---
permalink: /blog/coding-javascript-small-chunks/index.html
title: 'Working in small chunks'
intro:
  'This post looks at how I like to break down bigger projects into smaller
  chunks, and the advantages that brings.'
date: 2021-03-09
---

Although occasionally you'll be given a task to complete which can be completed
in no more than a few hours, most of your work is likely going to consist of
features that will take multiple days or even weeks to complete. I've found that
the longer a piece of work takes, the more likely I am to lose track of my
progress, forget which part of the feature I was going to build next, or realise
I've done work in the wrong order and have lost time because of it.

Regardless of how easy or hard the new feature is to build, the longer it takes
the more important it is to break the work down into manageable steps and make
sure you keep on top of it. You cannot keep weeks worth of work in your head;
taking the time upfront to plan your work will pay off, keeping your head clear
to work on the feature and ensuring you have a sense of where you're at at any
given point.

In this post I'll share some strategies I've found useful to help me plan and
stay productive when working on features that span multiple weeks and even
months.

## Plan the small steps ahead of time

The first thing I'll do when starting on a new feature is create a new document
(this can be whatever format you prefer - I use Google Docs but know others who
always use a pen and paper, it's really down to your personal preference) and
write down a really rough list of bullet points that list all the different
pieces of work I need to complete to consider the overall feature complete. This
list is only for my eyes so I don't worry about formatting or structure and
instead use it as a way to brain-dump everything I can think of that I need to
do, or consider. Most features I work on are backed by a design doc, which lists
the scope and goals of the work, so I'll refer to that when creating my list.

Once I have this list, I can start to order it and decide which parts make sense
to prioritise first. When deciding where to start I'm considering the following:

- Are there any parts of the project that need to be completed first? Does doing
  one piece of work first unlock everything else?
- Are there any unknowns or risks with the feature? Do I need to get something
  working to validate the approach first? If so, I'll want to tackle this as
  soon as possible to avoid wasted effort later on.
- Do any of the pieces require help from another team member? If so, I might
  want to kick that off soon so I give my colleague some notice and don't force
  them to drop everything and help me immediately.

The planning here is very much an art not a science; even once I've created my
priority list it's highly likely that the list will change over time as the
project progresses. You're not trying to create the perfect, rigid plan, you're
trying to get a rough plan out of your head and written down so you can track
your progress and know what you're working on next.

## Using your doc as the work progresses

Once I dive into working on the feature I'll regularly refer back to my doc and
make changes. This might be adding bits of work that I've thought of as I've
been working, or reordering the list as I learn more about the required work.
I'll also tend to keep two more sections in my doc, one for open questions and
another for deferred features.

### Open questions

I use this part of the doc to track questions I have as I work. I like doing
this because sometimes I don't want to pause coding to ask a colleague a
question. I can instead write down the question and continue with my current
task. At the same time I then get the benefit of offloading that question from
my head and into the doc. I like keeping my head clear to focus on the current
task and the only way I find I can do that is to offload everything else into a
doc.

### Deferred features and preventing scope creep

Like with any big project, once you start you'll inevitably find further work to
be done, or corners to consider cutting. There's no rule here for if you should
take the quick hack or solve the problem "properly", and the answer for which
path to take will depend heavily on the context of the feature and the situation
at hand.

To avoid getting sidetracked into adding features that weren't initially
planned, I'll note them down in my doc under a "Deferred Features" heading. This
means I stay focused on my work but note down the feature to consider later, and
most of the time I'll ask a colleague for their opinion. If we decide the work
is definitely needed, we can incorporate it into the current workload - whilst
also asking ourselves if we could have planned better to see this work ahead of
time. If the work is important but not critical to the current feature we will
defer it for later, in which case we'll log a bug report into our bug tracking
system describing the feature, why we think we need it and why we've deferred
the work for now. You can use whichever tool(s) you or your company prefer here.

I've found that being explicit with the features that you defer is a great way
to avoid scope creep, because at anytime you've considered all the different
features that _could_ be added to your project. It also gives you ammunition
when someone asks "did you consider adding X?", because you can explain that you
did, but you deferred the work, and here's the link to the bug report/Trello
card/GitHub issue/JIRA ticket/e.t.c that explains your decision.

## Landing changes in small steps and working incrementally

Big changes that ship all at once are risky. The more you change in one go the
higher the risk of something breaking is when you put it in front of users. Once
I've got my list of steps and I've broken down the work into smaller pieces I'm
then trying to figure out if I can deploy my changes in these small steps. This
reduces the risk but also has the advantage of getting your code reviewed by
colleagues sooner, and enabling your colleagues to review fewer lines of code in
one go. Picture two developers; the first asks their colleague to review 200
lines that they've spent a week working on, and the other asks their colleague
to review 3,000 that they've spent 3 weeks working on. Which code review do you
think will be more thorough?

Now picture two different deployment strategies for a new feature:

1. The first deploys 8 weeks of work, spanning multiple thousands of lines of
   code, all in one go, turning on the new feature to all users at once.
2. The second deploys one to two hundred lines of changes weekly, behind a flag
   that enables the feature to be turned on/off quickly. At first it's deployed
   only for internal users, and as it nears competition it's then rolled out to
   a percentage of the user base before eventually being turned on for everyone.

The second strategy there reduces the risk right down. You can never eliminate
risk because any code change, however small, is risky, but with some planning
and upfront thought the risk can be kept to a minimum. Getting regular code
review on your smaller changes is also highly beneficial; we'll discuss this
more in the code reviews chapter.

## Small steps and git commits

Working in these small steps has also helped me become much better at leaving a
detailed trail of work in the form of git commits. Early on in my career I would
work solidly on a feature for days at a time without making a single git commit,
which now terrifies me just thinking about it! Regularly committing your work to
git (or any similar version control system) has many benefits: you can easily
get back to a working state if you break something, you can try things knowing
that you can undo them easily, and you can easily push your work up to GitHub
(or similar) so its backed up should your machine suddenly stop working.

One of the reasons I didn't get into the habit of committing often was because I
didn't want to spend time writing detailed commit messages. My company at the
time would squash all those commits into one before merging, so I didn't see
value in writing large commit messages that would then get squashed down. It all
changed for me when I realised that _I could do the squashing_ and I should
commit frequently largely for _my own benefit_.

My workflow now is to commit whenever I reach a natural stopping point, whether
that be fixing a small bug, finishing the first of ten steps on the path to
building a feature, or even writing a failing unit test that's going to be what
I now work on turning green. If I ever step away from my computer for a few
minutes to make a coffee, you can be sure I'll have committed my work.

Because when my work is merged into the main branch it's squashed into one
commit, the frequent commits I make as part of my workflow are really only ever
seen by me. So I don't need to be thorough and detailed, I just need to write
commits that make sense to me. Before I upload my work for code review, I can
rebase and update the git history.

If we take a typical feature, my local git commits might look like so:

- Write failing unit test
- Build initial module and implement `someFunc`
- Add UI component with basic functionality working
- Flesh out UI component and tackle edge cases
- Fix bug with fetching data from the API
- CSS tweaks
- Final unit tests and fixes

Notice that I don't ever really describe the actual high level feature I'm
building. I don't need to, because that's all in my head! And if I need more
context, I've got my doc where I've listed the steps, deferred features and any
open questions.

Once I've done all the work locally and I'm ready to upload my change I can now
rebase those commits. I rebase, squashing them into one large commit, and then
I'll write a brand new description, that might look like so:

```md
Add column resizing to data-grid component

This commit adds the ability for the user to resize the columns of the data-grid
using their mouse. It will resize relative to the overall size of the data-grid,
and when resizing a column all other columns are left untouched.

If you're rendering a data-grid and don't want to allow the user to resize the
column, you can set the `no-resizing` attribute on the `data-grid` component.

The column resizing logic is also aware of hidden columns, and won't resize
those, and it will re-adjust the column widths if the container is resized. Once
a user has resized the column, it will never have it sized changed
automatically. If you want to programmatically reset a column, you can call
`resetColumnWidths()` on the data-grid instance.

You can find more info here:

- Design doc: https://...
- Tracking bug: https://...
```

Now I take the time to dive into detail and write a thorough description of the
work (this will also make up the description of my pull request, so it's good to
be thorough here and leave lots of context). By doing this at the end I can call
out any particular edge cases or nuances that any other developer might want to
know about, and I leave a good trail in the history for me or any other
developer on my team working on the data-grid in the future.

## Being resilient to interruptions

It's a fact of life that you'll be interrupted when working by something. As I
write this the majority of us are working from home, so many have even more
chance of disturbance from family members as well as being pinged on Slack by
their colleagues. We've all seen the guidance that suggests software developers
should avoid being interrupted to avoid losing the mental context that's been
built up when a task is being worked on, but it's impossible to not have
interruptions on a daily basis. Your colleagues, very reasonably, will ask for
advice, your boss might want a quick chat about something (hopefully something
positive!) or, in my case, the dog will decide they need to go on a walk.

I still suggest you try to avoid being disturbed too regularly so that you have
time to get your head into work, and I will regularly turn my work chat off,
close my email, log out of other distractions and get my head down, but for
those times when you are interrupted mid-flow, working in the small steps that
we've discussed in this chapter will be very beneficial. You'll not be in the
middle of a huge change, where the entire product you work on is broken, and
you've a list of ten steps in your head you need to finish to get it back
working. You'll instead be part way through step five of ten, with the first
four already done and committed, and all other thoughts listed in your work doc.
For me now an interruption is a case of "give me five minutes to finish off",
where I leave the code in a state I can pick up again, often including a large
`// TODO: jack, make this function...` type comment that I'll pick up. I will
then add and commit my changes to git (literally using
`git commit -m 'WIP: step 4, add CSS'`, because as discussed I'll reword them
later) and at that point I've tucked my work away and I'm ready to give my
colleague/boss/dog full focus. It's vital when you do this that you offload all
the thoughts you have about your current work out of your head, so you can pick
up more easily. This might be `TODO` comments in the code, it might be in your
doc, or it might be hastily scribbled on a Post-It note. It doesn't matter
where, but get them out of your head. This frees up your mind to focus fully on
whatever now needs your attention

Working in small chunks has been very beneficial for my productivity, my mental
health, and my ability to offload tasks to documents (or paper) and focus on the
most relevant task at hand. What tips and tricks have you found useful -
particularly during these last 12+ months of primarily working from home? Get in
touch on Twitter, I'd love to hear them!
