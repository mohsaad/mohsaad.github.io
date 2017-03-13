---
layout: post
title: Setting up a TP-LINK WNDR3200 with Ubuntu 16.04
---

So I bought a TP-LINK WNDR3200 to utilize the dual-band capabilities on my computer. My original laptop didn't have a 5 GHz adapter, making the network fairly slow in congested areas like my last apartment. The dual-band adapter works fairly well on Windows, but there was no original Linux drivers for the device. However, I was able to find [this tutorial](http://www.ctheroux.com/ralink-rt5572-based-wifi-usb-dongle-setup-on-ubuntu-12-04/) which uses the exact same driver that I did. However, I had to make a few changes to the driver code to get it working on Ubuntu 16.04, which I'll write about here.
