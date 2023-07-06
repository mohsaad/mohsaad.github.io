---
layout: post
title: Always redirecting to https in Nginx
description: "Fixing an issue I've had for a while."
category: articles
tags: [web]
comments: true
---

I had an issue with Nginx where for the life of me, I could not figure out why my site would not redirect from www.mohsaad.com to mohsaad.com. I had already tried establishing an A record in my DNS:

```
www         A       1h      IPV4 address
www         AAAA    1h      IPV6 address
```

What this'll do is turn all the requests from any client to your server located at the specified addresses. From there, it's all about the server configuration. As a relative newbie to this, I got lost in many a StackOverflow configuration. But it turns out, the answer is pretty simple.

I run an https site with SSL (more on this later, this is also a headache). So I naturally want to redirect all http traffic to https. To do this in Nginx, the first server block has to be something like this:

```
server {
    listen          80;
    server_name     _;
    return 301 https://yourdomain.com
}
```

Since I have a certificate for mohsaad.com, I just redirected all my traffic to [https://mohsaad.com](https://mohsaad.com). The key here is the `_` in the server_name, as that allows the server to accept any traffic that comes to it and redirect it appropriately. This might be dangerous... but since I have no input on my site, I don't think it'll matter.
