---
layout: post
title: Comparing rendered Arabic in various terminal emulators
description: Finding a good terminal for writing Arabic in vim
tags: ['arabic', 'bash']
---

Most terminals have an issue with displaying Arabic in vim. The Arabic either seems super smushed together, like this:

![Mac Terminal]({{ site.blog_url }}/assets/posts/mac_terminal.png)

Or like this:

![Ubuntu basic terminal]({{ site.blog_url }}/assets/posts/ubuntu.png)

What I was looking for is a clean terminal that renders the text well, and is actually readable. Most of these either smush them together, forcing me to render the text later to check, or are just hard to read.

Thankfully, I found a terminal emulator called [Tilda](https://github.com/tilda/tilda) which renders the Arabic text well, and cleanly. It also has a nice pull-down feature, which is useful. This is how Tilda renders text.

![Tilda]({{ site.blog_url }}/assets/posts/tilda.png)

I also investigated a few other terminal editors. This is how their Arabic looks.

# Mac OS X Default

![Mac Terminal]({{ site.blog_url }}/assets/posts/mac_terminal.png)

# Ubuntu default

![Ubuntu basic terminal]({{ site.blog_url }}/assets/posts/ubuntu.png)

# Tilda

![Tilda]({{ site.blog_url }}/assets/posts/tilda.png)

# Guake

![Guake]({{ site.blog_url }}/assets/posts/guake.png)

# Terminator

![Terminator]({{ site.blog_url }}/assets/posts/terminator.png)

# Xterm

![Xterm]({{ site.blog_url }}/assets/posts/xterm.png)

It seems that a lot of the editors have the same issue, which is that their encoding bunches all of the text up when you type. I'm curious what Tilda does differently - seems that their encoding spreads out the
characters instead.
