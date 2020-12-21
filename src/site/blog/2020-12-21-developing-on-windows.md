---
permalink: /blog/software-javascript-development-windows-10-wsl/index.html
title: 'Software Development on Windows 10 with WSL2'
intro:
  'This post shares how I have configured Windows 10 and WSL2 to enable me to
  build software on my Windows machines.'
date: 2020-12-20
---

Back in
[October 2019 I'd taken the plunge and tried Windows for my development work](/blog/frontend-development-with-windows-10/).
It was largely a succesful experiment. By using the
[Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/install-win10),
I was able to run most of my tools effectively in Linux, something I'm familiar
with, and with
[VSCode's WSL Remote plugin](https://code.visualstudio.com/docs/remote/wsl), I
could run VSCode in Windows connected to the Linux environment provided by WSL,
and things felt very familiar.

### Shortcomings of WSL

That said, there were some minor issues and frustrations with WSL and this
workflow. The main one was that WSL 1 was known to be much slower at file reads
and writes. You might think this isn't a huge deal - but if you're running a
package manager like `npm` and installing a bunch of dependencies, those reads
and writes add up to the point where it's noticably slow (and I'm running on a
fairly beefy XPS laptop).

WSL 1 also had some holes in terms of application support, you couldn't use
Docker - not something I do regularly, but something that's useful to be able to
reach for - and at times I found the VSCode WSL integration to be slightly
laggy. Not much, and not often, but everything wasn't _quite_ as smooth as it
would be on the MacBook I usually worked on.

### Enter WSL 2

WSL 2 (see an [intro video here](https://www.youtube.com/watch?v=MrZolfGm8Zk))
promised major improvements over WSL 1. I can't go into the details of the
implementation, because frankly it's way over my head, but from the learnings of
the successes and failures of WSl 1 Microsoft were able to make amazing
improvements in WSL 2.
[This comparsion on the MS site shows all the differences](https://docs.microsoft.com/en-us/windows/wsl/compare-versions#:~:text=WSL%202%20provides%20the%20benefits,user%20experience%20as%20WSL%201.),
but the highlight for me was that file IO performance was drastically improved -
the docs quote 2-5x faster for running tools such as `git` or `npm`. I haven't
benchmarked, but running WSL 2 feels _so much snappier_ and I don't feel a
noticable delay when running a large `npm install`. Additionally, WSL 2's
architectural changes enable it to run many, many more apps, so using tools like
Docker is now possible.

And, you could upgrade a WSL 1 install to WSL 2, so the upgrade path was super
smooth!

### Starting fresh

Given all the experimenting I'd done when I first got the laptop to get WSL 1
installed (I had to install a Windows Insider build to get it, whereas now WSL
is available on the regular build), and the fact that the laptop was a bit
bogged down with various bits of software and accumulated "stuff", I decided
last week to completely reformat the machine and start a fresh.

For my future reference, for when I do it again or get a new machine, and for
others who may be interested in doing software development on Windows 10, I
decided to document the steps I took. Spoiler: there actually aren't that many!

### Reinstalling Windows 10

You can install Windows however you like; my XPS came with a recovery disk,
which I got at via "Reset this PC" in System Settings. That let me do a factory
reset of the machine and left me with it running the same version that it was
when it first shipped to me. That was a super smooth process, but left me with a
Windows that was over a year out of date, so the first thing I did was let the
software updater do its thing. Many downloads and restarts later, I had a fresh,
up to date Windows 10 all ready to go.

### Browser and 1Password

I'm a big fan of [1Password](https://www.1password.com) for storing all my
passwords and the main way I access it is via the Google Chrome extension, so my
first port of call is to download Chrome and sign in so all my extensions,
including 1Password, get synced.

### WSL 2 and Ubuntu

I run the Ubuntu distro on WSL 2, but these steps should be the same regardless
of which distro you'd like to run. I followed
[this guide on the Microsoft site](https://docs.microsoft.com/en-us/windows/wsl/install-win10).
It's got a fair few steps - you first have to enable WSL 1, then upgrade to WSL
2 (I'm not sure if in time this will change), then download a kernel update (far
less scary than it sounds), before setting the default version to WSL 2, and
_finally_ then installing Ubuntu.

> The docs mention that if you're on the Windows Insiders build, you can use the
> experimental `wsl --install` command.

This process is a bit manual and takes a few minutes as some of the steps
require a restart of your machine, but it's just a case of following the
instructions carefully and you'll be up and running.

### The Windows Terminal

One of my major sticking points for Windows was the lack of a good terminal
application. On OS X / Linux there's a great choice between the built in
defaults, iTerm 2 (Mac) or others such as Alacritty (cross platform).

Thankfully Microsoft are rectifying that with the
[Windows Terminal](https://docs.microsoft.com/en-us/windows/terminal/get-started),
which is looking great! Whilst it's still got a few rough edges (primarily a
lack of a settings interface, so you configure it via a JSON file only) it's
really come a long way and I highly recommend it. When you run it, it will load
a Windows Powershell by default, but you can
[customise the default profile](https://docs.microsoft.com/en-us/windows/terminal/customize-settings/global-settings#default-profile),
so I've set it to load my Ubuntu WSL 2 environment by default.

### VSCode

VSCode is my editor of choice and is really the best option on Windows for me
because of the previously mentioned WSL integration. I donwload this onto
Windows and then use the
[VSCode settings sync](https://code.visualstudio.com/docs/editor/settings-sync).
This used to require an extension to VSCode but is now built-in, and I use this
to sync settings between my machines. This means I can download VSCode, log in
and sync, and then all my extensions and settings will be downloaded for me. If
you use VSCode, I highly recommend syncing your settings. Even if you only use
one machine at all times, it's a great way to back up your settings should you
have to reformat your machine in the future.

### Diving into Ubuntu

At this point I've now got everything set up on the Windows side, and I fire up
the Windows Terminal to get the Ubuntu environment configured. These steps are
largely personal preference, but the tools I reach for are:

1. [Fish](https://fishshell.com/) as my shell, along with
   [Fisher](https://github.com/jorgebucaran/fisher) for managing the plugins. I
   use `chsh -s (which fish)` to change the default shell to Fish, so when I
   load up the terminal it loads into Fish by default.
2. I use [asdf](https://asdf-vm.com/) to manage all my versions of various
   languages, such as Node. I like asdf because it works well, never conflicts
   with other tools, and can be used to manage loads of languages - so I don't
   have to have separate tools for Ruby, Node, etc, but just use asdf for
   everything. I then immediately install Node as that's the main language I
   rely on.
3. I then install the
   [GitHub CLI](https://github.com/cli/cli/blob/trunk/docs/install_linux.md). I
   love using this to create and clone repositories
   (`gh repo clone jackfranklin/dotfiles`) and also `gh pr create` to create
   pull requests.
4. I install my [dotfiles](https://github.com/jackfranklin/dotfiles) which I've
   built up over the years and they have plenty of little snippets that I rely
   on, including my custom
   [aliases](https://github.com/jackfranklin/dotfiles/blob/master/fish/config.fish#L1)
   which I have safely in muscle memory and help me go quicker through the
   terminal.
5. I follow the
   [GitHub guide](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent#generating-a-new-ssh-key)
   to generate a new SSH key (I can _never_ remember the steps!) and add that to
   my GitHub profile, so I'm ready to clone, push and pull against both my
   public and private repositories.

### Conclusion

I find Windows 10 a great environment to be productive in; the improvements to
WSL 2 along with the ability of VS Code to connect seamlessly to it to create an
environment that is pretty close to the Linux environments I usually have set-up
on the Mac machines I normally work on.

With
[WSL set to gain the ability to run Linux GUI apps](https://www.zdnet.com/article/microsoft-linux-gui-apps-coming-to-windows-10-wsl-along-with-gpu-access/)
it's exciting to see how Windows 10 and WSL progresses in the next few years.
