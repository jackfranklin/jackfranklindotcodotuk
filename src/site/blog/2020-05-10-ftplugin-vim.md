---
permalink: /blog/using-ftplugin-in-vim/index.html
title: 'Using ftplugin to tidy my Vim configuration'
intro: "A discovery of a pretty basic Vim feature that I've never used."
date: 2020-05-10
---

I've used Vim on and off for a long time. I got introduced to it at University
by a lecturer, tried it, didn't get it, and moved on. I then decided to learn it
more seriously and spent a lot of time configuring it, as my
[dotfiles repository](https://github.com/jackfranklin/dotfiles) shows. It's on
1203 commits!

Often in Vim you'll want to have different settings for different filetypes.
Foexample I want to configure Markdown files to have spell-check turned on at
all times, but when I'm coding I don't care for spell-check being on.

In the past I would have done this with an `autocmd`:

```
autocmd FileType markdown setlocal spell spelllang=en_gb
```

But then your `vimrc` (or `init.vim` for Neovim users like me!) gets cluttered
with these and it's hard to keep up, or find exactly where you configured those
Markdown settings.

Instead, you can use ftplugins for this case! A `ftplugin` is a file type plugin
that will be run automatically when Vim detects you're editing a file of that
type.

So instead of cluttering up my `vimrc` with `autocmd` lines, I can instead
create `~/.config/nvim/ftplugin/markdown.vim` with the settings I want in:

```
setlocal spell spelllang=en_gb
```

> If you're using Vim, not Neovim, you can create
> `~/.vim/ftplugin/markdown.vim`.

This keeps my `vimrc` tidy, and my dotfiles easier to manage. It's very
straightforward to remember which settings I've applied globally (they are in my
`vimrc`) or per-filetype, in which case I can dive into my `ftplugin`s folder.
