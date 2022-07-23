---
permalink: /blog/executing-tasks-in-neovim/index.html
title: "Running command line tasks in Neovim"
intro: "How I combined a few Neovim plugins with some custom Lua code to easily run tasks." 
date: 2022-07-23
---

My daily workflow often involves repeatedly running tasks, whether that be build commands, unit tests, or some other scripts. My ideal workflow is to have a terminal split on the right hand side, and then be able to send tasks to it.

## The built in terminal

Neovim's built in `:terminal` allows me to easily open a terminal as a split in Neovim, and I have a few custom keymaps to jump to and from it.

Rather than use `<C-w>{h,j,k,l}` to navigate splits, I remap to `<C-{h,j,k,l>`, and I add the same mappings to the terminal splits, along with mapping `<Esc>`:

```bash
tnoremap <Esc> <C-\><C-n>
tnoremap <C-h> <C-\><C-n><C-w>h
tnoremap <C-j> <C-\><C-n><C-w>j
tnoremap <C-k> <C-\><C-n><C-w>k
tnoremap <C-l> <C-\><C-n><C-w>l
```

I also prefer to always be in insert mode by default when entering a terminal split:

```bash
autocmd BufEnter * if &buftype == 'terminal' | :startinsert | endif
```

## Neoterm plugin
To make things a little easier to manage, I also use the [Neoterm plugin](https://github.com/kassio/neoterm). This gives me the ability to run:

```bash
:T ls
```

To open a terminal and execute the `ls` command. If you then run this command again, it will re-execute the terminal command but _in the same terminal_. You may start to see how this is going to form the building blocks of my setup of a terminal that I continuously execute tasks in...

I can then set `neoterm_size` and `neoterm_default_mod` to define how the terminal appears. I set it to approximately 30% of the screen width, and to be vertical on the right hand side:

```lua
vim.g.neoterm_size = tostring(0.3 * vim.o.columns)
vim.g.neoterm_default_mod = 'botright vertical'
```

> This config is in Lua rather than Vimscript because I only use Neovim. The previous configuration code shown is due to be migrated but I've not got round to it yet!

## Mapping a key to execute a command

I don't want to have to manually run `:T my-command-here` every time I want to run tests. So I started manually setting a shortcut when I would need to have a command setup, such as running tests:

```bash
:nnoremap <leader>e :T npm test<CR>
```

This worked well, but had some caveats. Firstly, I use Neoterm to fire up multiple terminals (I often have some in other tabs for other commands), and `:T` would reference the latest terminal. So to fix that, I adjusted the command to `:1T`, which would target the first terminal.

I also wanted to have the terminal cleared between each execution of the command. I did that at first by using the `clear` command:

```bash
:nnoremap <leader>e :1T clear && npm test<CR>
```

But I then discovered Neotree's `:1Tclear` command which would clear the terminal for me, without me having to include `clear` as the first task.

My final problem is that I was bored of typing this mapping manually! So I set out to automate it...

## Building the task execution command

I wanted to have a mapping for `<leader>e` that would:

1. Create a terminal if required, or re-use the existing one otherwise.
2. Prompt for a command to automatically run. 
3. Once a command is given, store that and use it again for future runs (e.g. only prompt once for a command).
4. Clear the terminal between each run.
5. Provide an option to reset the command.

Requirements (1) and (4) are easy; Neoterm's behaviour gives me those for free. To create a command that I can then bind to a key I can use [`nvim_create_user_command`](https://neovim.io/doc/user/api.html#nvim_create_user_command()):

```lua
vim.api.nvim_create_user_command('TaskPersist', function(input)
  -- implementation here
end, { nargs = '*' })
```

And I know already that I can execute a command (stored here as `cmd`) by using Neoterm:

```lua
vim.api.nvim_command(":1Tclear")
vim.api.nvim_command(":1T " .. cmd)
```

So now I need to store a command, and find a way to set it if it's not provided. I could do this via setting some global variable, but I want it to be a nice UI! This is where [nui.nvim](https://github.com/MunifTanjim/nui.nvim) comes in. I already have it in my `init.vim` file, because another plugin I use depends on it. And it has an [`Input` component](https://github.com/MunifTanjim/nui.nvim/tree/main/lua/nui/input)!

I create a variable, `stored_task_command`, which will be a variable within this Lua module that tracks the current command. Initially it's set to `nil`.

I can create `trigger_set_command_input` as a function which will create and mount an `Input` component. When the input is submitted, we set `stored_task_command` to the input, and trigger a callback function that is provided:

> Most of this code is straight from the `nui.nvim` example; I've just modified the text prompts and the width of the input!

```lua
local stored_task_command = nil

local trigger_set_command_input = function(callback_fn)
  local input_component = Input({
    position = "50%",
    size = {
      width = 50,
    },
    border = {
      style = "single",
      text = {
        top = "Commmand to run:",
        top_align = "center",
      },
    },
    win_options = {
      winhighlight = "Normal:Normal,FloatBorder:Normal",
    },
  }, {
    prompt = "> ",
    default_value = "",
    on_submit = function(value)
      stored_task_command = value
      callback_fn();
    end,
  })

  input_component:mount()
  input_component:on(event.BufLeave, function()
    input_component:unmount()
  end)
end
```

And with that, I can now provide a nice UI to set the command.

## Putting the pieces together

So, the final implementation should:

1. Use Neoterm to create or re-use an existing terminal
2. If `stored_task_command` is `nil`, trigger the `Input` box to set the command.
3. Run the command in the terminal (via Neoterm), after calling `:Tclear`.

```lua
vim.api.nvim_create_user_command('TaskPersist', function(input)
  local execute = function(cmd)
    vim.api.nvim_command(":1Tclear")
    vim.api.nvim_command(":1T " .. cmd)
  end

  if stored_task_command == nil then
    -- Load up the Input component to get a value, then run it
    trigger_set_command_input(function()
      execute(stored_task_command)
    end)
  else
    execute(stored_task_command)
  end
end, { nargs = '*' })
```

And with that, it works! I can bind to a key:

```lua
vim.api.nvim_set_keymap("n", "<leader>e", ":TaskPersist<CR>",{})
```

And the behaviour is as desired :)

![Executing a task in NeoVim](/images/nvim-task.png)

## Allowing random one-off tasks

Sometimes I do need the ability to reuse the terminal I'm running my tasks in for a quick one-off task. For that, I can make the custom `TaskPersist` command optionally take a command to use for just this one run:

```bash
:TaskPersist echo "some one off task"
```

Which can be done by reading the arguments when defining a custom command:

```lua
vim.api.nvim_create_user_command('TaskPersist', function(input)
  local execute = function(cmd)
    vim.api.nvim_command(":1Tclear")
    vim.api.nvim_command(":1T " .. cmd)
  end

  local one_off_command = input.args

  if one_off_command and string.len(one_off_command) > 0 then
    execute(one_off_command)
  elseif stored_task_command == nil then
    trigger_set_command_input(function()
      execute(stored_task_command)
    end)
  else
    execute(stored_task_command)
  end
end, { nargs = '*' })
```

Setting the `nargs` option to `*` tells Vim that this command takes any number of arguments (Vim sees each space in the command as a different argument). These are collected for us as `input.args`, and we can execute those arguments as a command if they are supplied.

## Resetting the command

I've also created another command to enable me to be re-prompted for a new command to store:

```lua
vim.api.nvim_create_user_command('SetTaskCommand', function()
  trigger_set_command_input(function ()
    -- Don't need to do anything here beyond set it
  end)
end, {})
```

And with that, it's done!

I hope you enjoyed this walk through the process of combining a couple of Vim plugins with some Lua to enable the desired workflow. This post also demonstrates why I was so keen to dive into Neovim rather than stick to Vim. I'd never written a line of Lua six months ago, and whilst I remain a complete beginner, it is a language that I think anyone with some programming experience can get to grips with, and I'm loving the ability to have more fine-grained control over my editing experience by writing code.

If you want to grab any of the code from this post, you can find it [in my dotfiles, which are on GitHub](https://github.com/jackfranklin/dotfiles/blob/bda3964360ebf60330880416450357d3d672b815/nvim/after/plugin/neoterm.lua).








