---
layout: post
title: Creating a reading list and quotes page
description: A tutorial on Jekyll and parsing data files
tags: [blog, jekyll]
---

You may have noticed the reading list and quotes section at the top. I was inspired by a few others to build a reading list and keep track of books.
Normally, I'd use something like [Goodreads](www.goodreads.com), but Goodreads is terrible and I try to avoid it as much as possible. So inspired by <a href="https://jsomers.net/#books">James Somers</a> and [Chuck Grimmett](http://www.cagrimmett.com/reading/), I created my own reading list using [Chuck Grimmett's design](https://github.com/cagrimmett/jekyll-tools). The same design was used for the quotes page, and is actually simpler than the reading list - no CSS necessary.

First, we need to create a folder called `_data` and put in a yml file (I call mine `quotes.yml`). The yml file should have entries in this format:

```
- quote: Get busy living or get busy dying.
  author: Red
  source: The Shawshank Redemption
```

Then, in a separate folder called `quotes` (or whatever), place this inside your `index.html`:

{% raw %}
```html
---
layout: page
title: Quotes
---
<div>
  {% for entry in site.data.quotes %}
  <ul>
    <li>"{{ entry.quote}}"{% if entry.author %} - {{entry.author}}{% endif%}{% if entry.source %}, <i>{{ entry.source }}</i>{% endif %}</li>
  </ul>
  {% endfor %}
</div>
```
{% endraw %}

What will happen is that Jekyll will loop throigh the quotes file and try to pull each of the following quotes.
The if statements are really to check if the author and source are in the yml file. If they are, we will format
it accordingly, otherwise we will leave it out.

Afterward, we will get a nice quotes page with nicely formatted bullets!

![quotes](https://mohsaad.com/blog/images/quotes.png)
