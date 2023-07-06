---
layout: post
title: Setting up a TP-LINK WNDR3200 with Ubuntu 16.04
tags: [tech-support]
---

So I bought a TP-LINK WDN3200 to utilize the dual-band capabilities on my computer. My original laptop didn't have a 5 GHz adapter, making the network fairly slow in congested areas like my last apartment.

![TP-Link Adapter](http://static.nix.ru/autocatalog/wireless_tp_link/138605_2254_draft_large.jpg)

The dual-band adapter works fairly well on Windows, but there was no original Linux drivers for the device. However, I was able to find [this tutorial](http://www.ctheroux.com/ralink-rt5572-based-wifi-usb-dongle-setup-on-ubuntu-12-04/) which uses the exact same driver that I did. However, I had to make a few changes to the driver code to get it working on Ubuntu 16.04, which I'll write about here.

Here are the steps you have to take to get it working:

1. Download this tarball from here: [DPO_RT5572_LinuxSTA_2.6.0.1_20120629_EDITED.tar.bz2.bz2](http://www.ctheroux.com/publicfiles/DPO_RT5572_LinuxSTA_2.6.0.1_20120629_EDITED.tar.bz2.bz2)

2. Extract the tarball using these commands:

~~~~~~~~~
bz2 --decompress DPO_RT5572_LinuxSTA_2.6.0.1_20120629_EDITED.tar.bz2.bz2
bz2 --decompress DPO_RT5572_LinuxSTA_2.6.0.1_20120629_EDITED.tar.bz2
tar xvf DPO_RT5572_LinuxSTA_2.6.0.1_20120629_EDITED.tar`
~~~~~~~~~

{:start="3"}
3. In `sta/sta_cfg.c` at line 4928, edit the following from:

~~~
snprintf(extra, size, "Driver version-%s, %s %s\n", STA_DRIVER_VERSION, __DATE__, __TIME__);`
~~~

to
~~~
snprintf(extra, size, "Driver version-%s, __DATE__ __TIME__ \n", STA_DRIVER_VERSION);
~~~

This avoid a compile-time error where the macros are not recognized if you leave them outside of the string.

{:start="4"}
4. In `os/linux/rt_linux.c`, edit lines 1206 and 1207 from:

~~~
pOSFSInfo->fsuid = current_fsuid();
pOSFSInfo->fsgid = current_fsgid();
~~~

to
~~~
pOSFSInfo->fsuid = __kuid_val(current_fsuid());
pOSFSInfo->fsgid = __kgid_val(current_fsgid());
~~~

{:start="5"}
5. Run `sudo make` to compile the driver and `sudo make install` to install it.

6. Now, when you run `ipconfig` or look for Wi-Fi networks, you should see the network stick pop up.

Hope this helps!
