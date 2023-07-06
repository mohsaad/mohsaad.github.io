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

# UPDATE (6/19/2020)

It turns out the default Ubuntu system font does not support Arabic super well. The way to fix this is to change to a font
like Monospace Regular that does. To do that, go to Edit > Preferences > General, and check "Custom Font". Afterwards, your Arabic will look super nice!

![new ubuntu]({{ site.blog_url }}/assets/posts/new_ubuntu.png)
