---
layout: post
title: Installing NVidia drivers on Ubuntu 18.04
description: "NVIDIA drivers on Ubuntu."
category: articles
tags: [tutorials, cuda]
comments: true
---

CUDA is usually a headache to install, but Ubuntu 18.04 makes it relatively easier.

Before on Ubuntu 16, I ended up having to blacklist a bunch of options, boot into a `tty` console, disable the current X server, and then install the driver. Oh, and you had to run `sudo update-initramfs -u` which had to restart before you can install the driver. Then the driver would fail, and it'd be super frustrating!

I found out that it's actually pretty easy to do, as Nvidia has been uploading their drivers to `apt` for a while. So instead of dealing with runfiles and breaking installs, all you have to do is:

```
$ sudo add-apt-repository ppa:graphics-drivers/ppa
$ sudo apt update
```

Now, run 

```
sudo apt install nvidia-driver-XXX
```

In this case, I wanted to run 418, so I thre 418 in for XXX. It ran, generated all the scripts, removed nouveau for me, and I was able to get everything running in less than 15 minutes. Installing CUDA was easy, following the guide right after that.
