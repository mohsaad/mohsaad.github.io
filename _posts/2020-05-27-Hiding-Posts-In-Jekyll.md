---
layout: post
title: Hiding posts in Jekyll
description: A tutorial on how to hide posts from being displayed on your blog
tags: [jekyll]
---

To hide posts in Jekyll, add this piece of code to the top of your `post.md` file:

```markdown
layout: post
title: <title>
hidden: true
```

Then, wherever you render your posts (usually in `index.html`), there will be a piece of code
looping through each posts like this:

{% raw %}
```ruby
{% for post in paginator.posts %}
  <div class="list-post">
    ...
  </div>
{% endfor %}
```
{% endraw %}

Add this small snippet before the div to hide your posts:

{% raw %}
```ruby
{% for post in paginator.posts %}
  {% if post.hidden != true %}
    <div class="list-post">
      ...
    </div>
  {% endif %}
{% endfor %}
```
{% endraw %}

Now, any posts marked hidden will be hidden!
