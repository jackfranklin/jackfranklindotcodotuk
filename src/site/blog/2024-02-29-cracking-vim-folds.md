---
permalink: blog/code-folding-in-vim-neovim/index.html
title: 'Cracking Neovim code folding'
date: 2024-02-29
---

I have used Vim or variants like Neovim ever since the second year of
university, which means I've been using Vim for nearly 13 years (!).

In that time I have gotten very comfortable navigating my way through code and
codebases using Vim, and migrating to Neovim and its LSP setup has replicated an
experience very close to what VS Code provides, but with all the benefits (in my
opinion) of Vim.

One feature that I have never been able to get confident with is code folding. I
relied on it a lot during my roughly year long stint of VSCode + Vim mode but
just could not get a satisifying configuration and set of commands to make it
stick in Vim...until now!

The first step was
[Andrew Courter's video on code folding](https://www.youtube.com/watch?v=f_f08KnAJOQ)
which helped me get some basic settings in place and understand my different
options for how folding should work in Neovim. Neovim is able to use many
sources of truth for folds, from basic options like code indentation, through to
LSP servers supplying that information.

> Andrew recommends the plugin
> [nvim-ufo](https://github.com/kevinhwang91/nvim-ufo), but when I tried it I
> found it decreased performance and felt "janky" - your mileage may vary as
> it's clearly a popular plugin!

## Folding configuration

From Andrew's video I decided to try and set up folding again - firstly using
the UFO plugin as described above - before then deciding that I wanted to stick
to what was built in. After some experimentation I found the best combination of
settings that work for me:

### foldmethod and foldexpr

I chose to use
[treesitter](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#folding)
as my source of truth for folding. I chose this over the LSP option as I don't
always work in codebases that have an LSP configured - especially if I am
quickly hacking on a script. By using the treesitter grammar, I ensure every
file I load will have it.

```lua
vim.opt.foldmethod = "expr"
vim.opt.foldexpr = "v:lua.vim.treesitter.foldexpr()"
```

### foldcolumn

I don't like taking up room with an extra column to display information on
folds, so I turn this off.

```lua
vim.opt.foldcolumn = "0"
```

### foldtext

By setting this to an empty string, it means that the first line of the fold
will be syntax highlighted, rather than all be one colour. I prefer this
visually to a formatted line representing the fold with no syntax highlighting.

```lua
vim.opt.foldtext = ""
```

> At the time of writing this feature is only in Neovim nightly and not in the
> stable 0.9.X releases.

### foldlevel and foldlevelstart

Setting `foldlevel` sets the minimum level of a fold that will be closed by
default. Therefore I set this to `99` as I don't want this behaviour at all.

However, I discovered that I can use `foldlevelstart` to dicate upon editing a
buffer what level of folds should be open by default vs closed.

After some experimenting, I settled on `1` for this value, meaning top level
folds are open, but anything nested beyond that is closed. I've found this helps
with navigating a large file as not all the contents will be expanded initially.

```lua
vim.opt.foldlevel = 99
vim.opt.foldlevelstart = 1
```

### foldnestmax

This limits how deeply code gets folded, and I've found that I don't really care
for nesting some object 20 levels deep into a function (however rare that is!).
So I set this value to `4`, meaning that once code gets beyond 4 levels it won't
be broken down into more granular folds. I've found this means I can easily
toggle larger chunks of nested code as they are treated as one fold. I think
this a very subjective setting though!

```lua
vim.opt.foldnestmax = 4
```

## Keyboard shortcuts

I have to thank
[Lestoni on GitHub for this gist](https://gist.github.com/lestoni/8c74da455cce3d36eb68)
which lists out all the shortcuts. I don't use them all but have come to rely
on:

- `zR` open all folds
- `zM` close all open folds
- `za` toggles the fold at the cursor

I'm also trying to get used to navigating via folds with `zk` and `zj` which
move up/down to the next fold, but that's not made it into muscle memory just
yet.

## Any suggestions?

If you have any ideas for how I could further improve this setup, or suggestions
based on how you use folds, I would love to chat about it! You can find my
social accounts in the footer of this site :)
