---
layout: post
title: Visualizing C++ Dependency Networks
---

A couple weeks back I started a new job at Toyota Research ([they're hiring!](https://www.tri.global/careers/)). When exporing their codebase, I figured it would be nice to build a visualization tool for seeing how various files connect. 

To do this, I utilized [graph-tool](https://graph-tool.skewed.de/static/doc/index.html) to build a graph to visualize which files were included the most, which standard libraries were used, and more. While it still needs more organization (I need to figure out how to cluster all the nodes together visually and label them) it's a start.

To do this, I used python to scrape through every file in a specific directory and look for the `#include` macro in C++. This macro tells the compiler to basically insert that specific file into our current file. After that, I threw everything into a dictionary and drew an undirected connection between two files if they had a dependency. 

One interesting thing to note is that I'm pretty sure every compiler uses this internally - building a graph and then optimizing over variables inside the graph.

As an example of what this looks like, here's a visualization of the dependency network of [LSD-SLAM](https://github.com/mohsaad/dependency-visualizer):

![Imgur](https://i.imgur.com/hgB9xOe.png)

My code can be found [here](https://imgur.com/a/zJ1SgDP). To run it, run 

~~~bash
python build_graph.py <path to directory with c++ files>
~~~ 
