---
permalink: blog/devlog-javascript-ontrack-1/index.html
title: 'OnTrack devlog 1'
date: 2024-04-08
---

If you were to look at my Steam library you would see that most of my games are
strategy and logistics based (think Factorio) but with a healthy dose of
transport methods and networks (think Transport Fever 2 and OpenTTD).

I've always wanted a very specific, niche game focusing on building _passenger
networks_ that simulate how passengers travel - something I have never quite
been satisifed with in OpenTTD, Transport Fever 2, and other games that I've
played. I like the logistical challenge of moving cargo around, but it didn't
interest me as much as the idea of moving people across a map. So, I decided to
build it...

## Meet OnTrack

For over two years I have been working on an in-browser, web technology based
game all about running train networks and optimising them for passenger
satisfaction and financial revenue. It's far from complete, but also at the
point where it _sort of_ looks like a game, and a couple of people have been
able to spend some hours on it. There is no end state, and a lot of work needs
to go into the longevity of the game, but this is what it looks like...

> remember, this is far from finished, or even polished :)

In future posts, I will dive more into each of the systems the game has to
provide a (hopefully!) challenging and enjoyable experience for players. In this
post I'll give you a very quick overview.

First, you start a new game. Here you have a few options, but you're mainly
rerolling until you get a start you're happy with:

![Starting a new game](/images/ontrack/post-1/generation.png)

Once you have a new game, you are taken into the main UI and the game map:

![A new blank map](/images/ontrack/post-1/new-game.png)

The goal here is to begin to connect towns with track, at which point you can
run routes and trains on them. At the start of the game you are given some
nudges with a contract - the completion of which earns you a reward:

![The contracts view](/images/ontrack/post-1/contracts.png)

This contract is usually a hint at where to start, because you have limited time
to do so...

## The engineering window

In most logistics games at any point you can pause the game, make changes, and
then start it up. You can avoid a huge issue by pausing and editing your track
or your orders before it goes awry. I wanted to avoid that in OnTrack, which is
why each night during the _engineering window_ users are given a limit on how
many changes they can make. Once that window is done, trains run during the day
and you cannot alter anything!

During the first night, your best bet is to use your changes (in the very first
window of the game you get more, to enable you to get started) to connect towns
with track:

![Placing track](/images/ontrack/post-1/placing-track.png)

Once track is placed, you can then create a route. When creating a route you set
its schedule, train size and more:

![Placing track](/images/ontrack/post-1/new-route.png)

But it's important not to run empty trains! These will cost you money and not
make any revenue. To avoid this, you can click on each town to view where and
when passengers want to travel:

![Town demand](/images/ontrack/post-1/town-demand.png)

And once you run trains, you will see them going along the track:

![Town demand](/images/ontrack/post-1/trains-on-track.png)

## Making money

But ultimately, like any game, the goal of OnTrack is to make sure your company
is successful, and one axis to judge any company on is its revenue. In OnTrack
you can break down your ins and outs and see where you are making (or losing)
money. First the daily summary will give you a high level overview (each of
these parts will be explored in future blog posts):

![Town demand](/images/ontrack/post-1/daily-summary.png)

Before you can use the financial view to get a more detailed look at the ins and
outs:

![Town demand](/images/ontrack/post-1/finances.png)

## The plans for OnTrack and this blog

I do not pretend to think that OnTrack will ever be a roaring success, but I
genuinely have always wanted a game like this for years and I think for a niche
audience this could be an enjoyable experience.

Right now I'm focusing on fleshing out the required features that would allow me
to call this game properly playable (with rough edges). The game is entirely
browser based and currently that's how it's built and played. Long term once I
hit a "v1" I'd liek to package it up - either with Electron, Tauri or some other
wrapper around web technologies.

As for this blog, I hope to blog semi-regularly with updates as I build out
certain features, or explore systems that I'm implementing.
