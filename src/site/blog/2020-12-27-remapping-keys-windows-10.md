---
permalink: /blog/remapping-keyboard-keys-windows-10-power-toys/index.html
title: 'Remapping Keys on Windows 10 with Power Toys'
intro:
  'How you can use the Keyboard Mapper in Power Toys to remap keys in Windows'
date: 2020-12-27
---

Since moving to Windows 10 something I've always struggled with is how to remap
keys on a keyboard. I don't remap much, but one remapping that I've used now for
about ten years is that I remap `Caps Lock` to `ESC`. This started when I was
learning Vim, and has become so commited to muscle memory that I can't go back
from it and I'm rendered useless on any machine that doesn't have this mapped!

On Mac OS this remapping was easy; the keyboard settings lets you remap certain
keys, and tools like [Karabiner Elements](https://karabiner-elements.pqrs.org/)
offered far more control. On Windows however, I could never find a solution. I
used [uncap](https://github.com/susam/uncap) and that did the job, but it was a
bit manual, and only (by design) offered limited functionality. I really wanted
a tool I could install, configure and forget about, that also gave me the
ability to remap multiple keys should I need.

### Power Toys

I then discovered
[Power Toys](https://docs.microsoft.com/en-us/windows/powertoys/), a free set of
programs for Windows 10 "power users" that provide a bunch of additional
functionality. I'm surprised some of these aren't built into Windows by default
(maybe one day they will), but one of the utilities that Power Toys provided is
[Keyboard Manager](https://docs.microsoft.com/en-us/windows/powertoys/keyboard-manager).

Keyboard Manager lets you define mappings intuitively; you hit the key you want
to remap, then press the key ou want to remap it to. In my case, I hit
`Caps Lock`, then `ESC`, and it was done! It also provides a visible list of
mappings, and makes it easy to remove them if you make a mistake or change your
mind.

I highly recommend checking out Power Toys, it has much to offer including a
[Window layout manager](https://docs.microsoft.com/en-us/windows/powertoys/fancyzones)
and a
[OS X Spotlight-esque launcher](https://docs.microsoft.com/en-us/windows/powertoys/run).
I'll definitely be exploring these further!
