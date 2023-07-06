---
layout: post
title: Visualizing networks of Facebook friends
description: Can we visualize our own friend network?
tags: ['projects']
---

A few years ago, I downloaded my Facebook data, curious as to what insights I'd find. Turns out, there's a lot of information stored in your
downloaded Facebook data, and it's pretty interesting to look through it. My old project can be found [here]({{ site.blog_url }}/blog/2017-12-19/Data-Mining-Facebook/).

However, one thing is missing from this data - and that's what's called your social graph. The social graph is a network of all your friends and how they're interconnected, whether that's by mutual friends or similar interests. For me, I was really interested in how my social circles overlapped. I've always had this idea that my social circles are very disparate, sorted by time and location (pre-HS, HS, College, SF), and I wanted the visualization to prove it.

Using some online scrapers, I managed to download a list of my friends as well as all my mutual friends, and prepare a visualization
showing my entire friend network, and how they're interconnected. This is what it looks like:

![Friend Network]({{ site.blog_url }}/assets/posts/friend_network_2.png)

To do this required a few steps:

1. We need to grab a list of our friends. This is done by downloading our Facebook data and looking for our current friends list,
excluding any removed friends.

2. We need to grab the data from Facebook and specifically look for CSS elements that contain the names of our mutual friends. We can do this
by using a scraper, or a script that grabs web pages that show my mutual friends with each person. The way I did this was by using Selenium,
which is a test-kit for web apps. It allows us to do things like click on buttons, fill out forms, and grab HTML pages. (This is pretty much all
we need anyways). Using that, we can program our test kit to go to Facebook, log in, go to the correct page, and download that page. We do need to wait a bit between pages, as Facebook will detect suspicious activity if you instantaneously go to each friend's page. (A random time delay should
work).

3. Using each HTML page, we need to search for the correct CSS element, and then plug that into our dictionary of people to add it to the list. This
should be done in memory, but you can also load a pickle and save it. You'll have to hunt for the CSS element yourself :).

4. After processing all the data, we utilize [D3](https://d3js.org/). For this, I used a simple [force-directed layout](https://observablehq.com/@d3/force-directed-graph) which organizes the nodes by
connections to other nodes. If a lot of nodes are similar / well-connected, then they tend to bunch up together in a specific layout. Really, you
can think of it as nodes being grouped by the number of similar connections. Nodes with connections to two groups are strung out between them, which is also interesting.

That's pretty much it for the visualization. There's a lot of interesting things to take note here. One is that each of these does tend to represent
very different social groups, even the smaller in/out groups. For example, my extended family all bunches out together, with a few connections
to random other groups. Another interesting thing that I'm curious about exploring is to visualize the nodes being added by time, and see how exactly
this network is populated, and how the force direction changes because of it. One last thing to note is that there are a few extra outliers surrounding
the circle with no connections. Some of these are actually one-offs, but also a few of them are bad Unicode to non-Unicode translations and should
be included in the network.

Coming up: more visualizations and analysis!
