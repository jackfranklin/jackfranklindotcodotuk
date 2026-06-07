---
permalink: blog/ai-review-plan/index.html
title: 'ai-review: reviewing AI code before it lands'
date: 2026-06-07
---

Over the years I have become very comfortable as a developer who spends most of
his time in the terminal. I've spent far too long tweaking my
[dotfiles](https://github.com/jackfranklin/dotfiles) to make things just how I
like, and I have been a Vim/Neovim user for the best part of fifteen years.

This trend has continued into the AI era. I've tried various IDEs and UI tools,
but I always come back to Claude Code, Gemini CLI, and others.

## The problem with terminal AI tools

There is one area where I have always been jealous of IDE users: reviewing AI
plans and code. Claude will present a plan in the terminal, but it's just hard
to review in detail, and I cannot highlight specific lines to leave feedback on.
The same problem hits once the code is written — scrolling through a terminal
diff isn't fun nor is it a good way to spot problems, at least not for me.

So, I built [ai-review](https://github.com/jackfranklin/ai-review-plan).

![ai-review in the browser](/images/ai-review.png)

AI Review offers you a way to review the plan, or a git diff, in the browser.
You can leave line by line feedback, and have space for general comments too.
Once you're done, your comments and the lines they reference are passed straight
back into the conversation for the agent to act on.

This gives you the comfort of a terminal AI agent, with the ability to
intuitively review the plan in the browser, using your mouse and keyboard.

My workflow is now:

**Planning phase:**

1. Work with the AI to plan a piece of work.
2. Prompt the AI: `/review-plan put the final plan together`
3. Once it loads up in the browser, I review and leave feedback. I can repeat
   these steps until I am happy.
4. The AI implements the plan.

**Code review phase:**

5. Prompt the AI: `/review-diff let me review your code`
6. Review the diff in the browser, and leave line-by-line comments.
7. Repeat until happy :)

If you're more of a visual learner,
[I recorded a video which shows my workflow for reviewing plans with this tool](https://www.youtube.com/watch?v=k3J1jSRP6Vw).

## Using it

You can find full
[instructions on GitHub](https://github.com/jackfranklin/ai-review-plan) but the
TLDR is:

1. `npm install -g @jackfranklin/ai-review` (note: the npm package is just
   `@jackfranklin/ai-review`, not `ai-review-plan`)
2. Add the `/review-plan` skill to your agent.
   [Here is a template from the GitHub repo that you can use as a starting point](https://github.com/jackfranklin/ai-review-plan/blob/main/skills/review-plan.md).
3. Use it!

If you have feedback, you can find me
[on various platforms here](https://jackf.io) or leave an issue on the GitHub
repo. Happy plan and code reviewing!
