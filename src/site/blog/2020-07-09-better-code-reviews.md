---
permalink: /blog/how-to-do-good-code-reviews/index.html
title: 'Better code reviews'
date: 2020-07-09
intro: "Tips, tricks and thoughts on how to make your team's code review process
as efficient and effective as it can be."

---

When you get a code review request from a colleague, what do you focus on? What
reaches the bar for what you consider something that's worth commenting on? And
do you make it clear when you're making a comment on something vs considering
something so important to change that the code review shouldn't be merged
without it?

Code review is hard. I've seen people do it really well and people do it really
badly, but most of us are somewhere in the middle. Giving feedback to people is
hard, and it takes practice to be comfortable taking feedback on that large
piece of code you've spent the last couple of days thinking about. Code reviews
are so crucial to a team's pace, but also their happiness. I've seen bad code
reviews become almost infamous and hurt a team's culture because people start to
feel unsafe sharing their code for review. A good code review process gets you
better code in the codebase whilst at the same time boding your team, increasing
knowledge sharing and providing a great opportunity for team members to learn
from each other.

With that in mind, here's some things I've learned that have helped me improve
code review - both reviews that I get from others, and reviews I give others:

- **Automate as much of code review as you can**. Code review isn't for comments
  on syntax, or the use of single quotes over double quotes, or for spotting
  variables that aren't used. Use ESLint or other such tools rigorously to
  enforce your team's coding styles, and reach for a code formatter like
  Prettier that auto-formats code to a style. Not everyone may not love every
  formatting choice, but that doesn't matter. Time spent arguing the amount of
  spaces to indent is not worth it.

- **As the creator of the code, leave comments or links to context where it
  makes sense**. We've all made a change that has a piece of code that seems odd
  on first glance. Maybe you have to implement some really odd logic that
  doesn't make sense until you really dig in, or you had to work around a
  browser bug and apply a weird CSS trick to get it to look just right. Someone
  reviewing your code is going to see those oddities and ask about them. I like
  to proactively comment on my own code reviews with links to
  documentation/screenshots/etc that explain why the code is how it is (I often
  do this in actual code comments rather than comments on GitHub). That doesn't
  mean the code can't be improved, but it saves some back and forth explaining
  things to the reviewer. If the reviewer has more context they can spend less
  time figuring that out and more time thinking about your approach and any
  potential issues it might cause.

- **Assume good intent**. If you're reviewing some code and you can't understand
  why the author did it the way they did, one of two things is true: either the
  author is a dreadful developer, or they have some context that you don't. And
  hopefully it's incredibly unlikely to be the former! They might have tried it
  three other ways before settling on that option, or there might be a
  requirement for the change that you've misunderstood. Never be afraid to ask
  for clarity or check your understanding of something. I learn nearly as much
  about a codebase from my colleague's code changes that I review as I do by
  making changes myself.

- **Make it clear if you're requesting a change or making a suggestion**. Most
  code review comments fall into one of two categories: something you noticed
  but don't feel that strongly about, or comments that you think absolutely
  should be fixed before merging the change. If you can make it clear in each
  comment how strongly you feel about it, and if it's a suggestion the author
  should feel free to ignore if they disagree, or if it's something that must be
  fixed. That way as the person going through your review on my code I can
  easily see the most important comments and focus on those, and I know when to
  initiate a discussion if I disagree with your suggestion, or when you're
  leaving a comment that I can choose to ignore or not.

We'll definitely be revisiting the topic of code reviews in future blog posts;
they are a great way to think about the code you're writing and its potential
confusion points (in my head I like to think "what would a reviewer say about
this?" or "what is non-obvious to the person reviewing this code?") to help me
improve my code.

In the mean time, I'd love to hear about your team's practices when it comes to
code review; feel free to
[let me know on Twitter](https://www.twitter.com/Jack_Franklin).
