---
layout: post
title: Terminal styling in Python with sty
description: Decorating the terminal with colors in Python.
category: articles
tags: ['python']
---

While building a small terminal application, I really wanted to style my terminal with different colors. This had a two-fold purpose - to help visualize stargazing conditions and to b) make sure it was visually distinct in the terminal. To do this, I came across the `sty` library ([source](https://github.com/feluxe/sty)).

This library is super nice - it allows support for 8-bit or 24-bt colors, and is totally cross-compatible with different operating systems. To add color to any text,
all you need to do is add the following commands:

```
from sty import fg, bg, ef, rs, RgbFg

foo = fg.red + 'This is red text!' + fg.rs
bar = bg.blue + 'This has a blue background!' + bg.rs
baz = ef.italic + 'This is italic text' + rs.italic
qux = fg(201) + 'This is pink text using 8bit colors' + fg.rs
qui = fg(255, 10, 10) + 'This is red text using 24bit colors.' + fg.rs

# Add new colors:

fg.set_style('orange', RgbFg(255, 150, 50))

buf = fg.orange + 'Yay, Im orange.' + fg.rs

print(foo, bar, baz, qux, qui, buf, sep='\n')
```

![Image](https://github.com/feluxe/sty/raw/master/assets/example_so.png)

(from the sty docs) 

And you get a nicely colored string with many options!

The color palette for 8-bit colors is pretty large too, as seen in the following image (also stolen from the sty docs):

![8-bit](https://github.com/feluxe/sty/raw/master/assets/charts.png)

Definitely give it a try!

