---
layout: post
title: Editing an Ubuntu Terminal prompt
description: Changing the Ubuntu terminal prompt to display useful info.
category: articles
tags: ['bash']
---

For a long time, I've been wanting to to edit my terminal prompt to display informating like my git directory, status, and what not. I found
[this article](https://gist.github.com/justintv/168835) which had a bunch of suggestions to do just that. I ended up going with [this one](https://gist.github.com/justintv/168835#gistcomment-1717504)
by [vankasteelj](https://gist.github.com/vankasteelj):


`export PS1='\[\033[0;32m\]\[\033[0m\033[0;32m\]\u\[\033[0;36m\] @ \[\033[0;36m\]\h \w\[\033[0;32m\]$(__git_ps1)\n\[\033[0;32m\]└─\[\033[0m\033[0;32m\] \$\[\033[0m\033[0;32m\] ▶\[\033[0m\] '`

This produces a really nice terminal output with multiline support and a shell command (not my image, but you get the idea)

![img](https://cloud.githubusercontent.com/assets/12599850/13578646/7bcc1114-e499-11e5-8c8c-861f33cfdb38.png)

I also learned a ton about what happens in the variable in [this article](https://vitux.com/how-to-customize-ubuntu-bash-prompt/) which I'll probably use to help customize
my terminal even more in the future.
