---
permalink: blog/claude-code-ai-feedback-skill/index.html
title: 'Tracking feedback with Claude Code'
date: 2026-04-24
---

I've been using Claude Code as a pair programmer, debugger, and feedback collector
while I playtest my game, [OnTrack](/blog/devlog-javascript-ontrack-1/). The
setup has worked so well that I ended up building a small custom skill to make
it scale and in this post I'll take you through how it works.

> (That last DevBlog was in 2024 (!), but I have continued to work on the game —
> with AI my pace and progress has quickened, even if overall I've less time
> since [becoming a dad](https://adadwhowrites.com/).)

## Pausing development to playtest

After a period of development, I like to do a playtest. I resist fixing things,
and instead I play the game for an hour, noting down bugs, thoughts and
suggestions as I go.

I used to do this in a Trello board, but I recently decided to try using Claude
as my bug collecting coworker and collate feedback in a markdown file. This
worked really well! One of the benefits of using Claude is that it was able to
detect similar feedback, or duplicates, or re-write old feedback to incorporate
new points that were related. It also grouped them as it went under different
categories such as UI, mechanics, or "quick wins".

## The problem of large Markdown files

As I then followed these playtesting sessions with fixes, I asked Claude to mark
feedback as complete by moving it into a separate document. In one hour of
playtesting I would easily pick up on 50+ issues I wanted to fix (the game is
far from done!) and one day I realised that the Markdown file with incomplete
items was 3,000 lines long, and the one with completed items was 4,000 lines
long!

Claude was managing this fine - but I could see that as time grew, this list
would become hard to manage, eat up more of my tokens, and become inefficient.
Asking Claude to list the outstanding issues, or all the issues under a
particular category, required it to read the entire Markdown file, even if I was
only asking about a subset.

## The solution: SQLite

I needed a way to store this data in a more structured form where Claude could
query it more efficiently — for example, getting all the titles of bugs without
having to read the entire description, or listing all items under a particular
category, or marking items as done and never having to parse them again unless
explicitly asked.

The table is straightforward — each row has a `title`, `detail`, `priority`,
`status`, `category`, `project`, and a `done` flag. That last one is the key
bit: completed items are never deleted, just hidden from the default `list`
output, so there's a full history if you ever want it.

So, I made a
[feedback skill](https://github.com/jackfranklin/dotfiles/tree/master/claude/skills/feedback)
that does just that and teaches Claude how to log, process and track ideas and
feedback from the playtesting session.

At its core is a
[Deno CLI](https://github.com/jackfranklin/dotfiles/blob/master/claude/skills/feedback/cli.ts)
that talks to an SQLite database. This database lets Claude query feedback
items and add new ones.

> Why Deno? Honestly, because I wanted to try building something in it rather
> than always reaching for Node. But Node (or any other runtime/language) would
> be fine here. Plus, Claude wrote it anyway :)

Rather than one database per project, I keep all the data in a single file (that
is in my `.gitignore`). When the AI looks up or adds items, it must tag them
with a `--project` flag.

Here is the AI listing projects (`routemaster` is the old, internal name for
OnTrack):

```bash
run list --project routemaster
```

And then looking at detail for a particular item. Here is another reason that
using an AI for this feedback shines - as you give it feedback it can also
analyse your code and system to make some potential implementation notes as you
go:

```bash
run show 32

[32] #024 — No visual confirmation when player performs an action (toast notification system)
Project:  routemaster
Priority: high
Status:   open
Created:  2026-04-22 07:08:06
---
Observation: When the player builds a station, finalises a route, places a bridge, or purchases
an upgrade, there is no transient visual confirmation. The action succeeds silently. Route
creation in particular is confusing — after going through the full finalise modal flow there is
no confirmation that the route was actually created.

Analysis: A notification system already exists. Logger (src/log.ts) is a singleton EventTarget
that stores LogMessage objects and dispatches NewLogMessage events. LogOutput
(src/views/log-output.ts) subscribes to it and renders a dismissing list — when
remove-old-messages attribute is set, messages auto-expire after 10 seconds. Currently used for
contract completions and town growth.
```

And adding an item (you can also edit an existing item by ID which looks nearly
identical):

```bash
run add --project routemaster \
  --title "Train detail window: journey progress bar disappears when train is delayed" \
  --detail "When a train is running late (shown in red), the journey progress bar in the train detail window stops rendering entirely. The delay
indicator and the progress bar appear to share state and one clobbers the other. Reproducible by letting any train fall behind schedule by more
than 2 stops." \
  --priority high \
  --category bug
```

And finally, marking an item as complete:

```bash
run done 75
```

## The feedback SKILL.md file

Because the CLI is intuitive and well documented, the
[actual skill](https://github.com/jackfranklin/dotfiles/blob/master/claude/skills/feedback/SKILL.md)
is fairly straightforward — it teaches Claude the CLI commands and adds some
guidance on how to use them well. The most impactful part has been telling it to
check for duplicates or related items before storing new feedback. I found I'd
often describe the same underlying issue in two different ways without
realising, and Claude catches that.

A couple of the other hints worth calling out:

- **Always `list` before `show`** — titles and IDs use far fewer tokens than
  full item details, so the skill tells Claude to get the lay of the land before
  diving into specifics. I didn't want it to have to view all the details of
  each task until I need it. If I made it list the detail by default, I wouldn't
  be saving any tokens over the Markdown file approach.
- **Infer the project from context** — rather than asking me every time, Claude
  figures out which project we're working in from the conversation and only asks
  when it's genuinely ambiguous.

## CLIs + skills

What surprised me most is how much the structure helps beyond the token savings — being able to ask "what are all the high priority bugs in the UI category?" and get a fast, accurate answer genuinely changes how you work through a backlog. Feel free to [grab the skill from GitHub](https://github.com/jackfranklin/dotfiles/tree/master/claude/skills/feedback) and let me know if you build something similar.
