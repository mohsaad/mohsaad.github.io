---
layout: post
title: Arabic Typesetting in Vim
description: Enabling and writing blog posts in Arabic using Vim.
category: Arabic
tags: ['arabic', 'vim']
---

My last two posts I ended up writing a lot of Arabic. As a non-native Arabic speaker (but someone who's known every letter for a long time) this was
hard to do on a keyboard, as all the letters and symbols are put in places where you might not expect. In addition, you need a program
that even supports Arabic typesetting, and one which can easily switch between them on the fly is even more annoying.

Thankfully, there's Vim, which I've been using at work pretty consistently for a couple months now.

## Writing Arabic in Vim

There's two components of writing Arabic in Vim. First, you have to set the entire vim buffer to type right to left, as is in Arabic script:

```
set rightleft
```

Then you can set the keymap:

```
set keymap=arabic
```

The Arabic keyboard is based on Microsoft's Arabic keyboard layout, which can be seen below:

![Arabic Keyboard](https://image.shutterstock.com/image-vector/arabic-computer-keyboard-isolated-on-260nw-1008707842.jpg)

Doing this all the time can be kind of annoying, so here's some Vim functions to define in your `vimrc` to switch automatically (thanks to Andreas Hallberg):

```
" English to Arabic.
nnoremap <Leader>e :<C-U>call EngType()<CR>

" Arabic to English
nnoremap <Leader>a :<C-U>call AraType()<CR>

" Swtich to English - function
function! EngType()
" To switch back from arabic
  set keymap= "Restore default US keyboard
  set norightleft
endfunction

" Switch to Arabic - function
function! AraType()
  set keymap=arabic
  set rightleft
endfunction
```

I have the Leader key set to "," so whenever I press "," + "a" I'll switch to Arabic typesetting. To do that, set the following in your `vimrc`:

```
" See leader key and timeout
let mapleader=","
set showcmd
```

## References

[1] http://andreasmhallberg.github.io/typing-arabic-in-vim/
