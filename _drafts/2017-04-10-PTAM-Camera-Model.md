---
layout: post
title: The PTAM Camera model
---

Recently I've been working with Google's Project Tango a lot, trying to
run SLAM and visual odometry on the platform to see how well it works. I'm using the
[Lenovo Phab 2 Pro](http://shop.lenovo.com/us/en/tango/), which has a "motion tracking"
camera as well as an IMU and depth sensor. The motion tracking camera is really just
a slightly wide-angle fisheye camera.

![Lenovo Phab 2 Pro](http://shop.lenovo.com/ISS_Static/WW/campaigns/2016/tango/images/Phab2-pic1-big.jpg)

To do any kind of odometry or SLAM, you need to have the 3D geometry in order. Thankfully,
the Tango's fisheye camera comes pre-calibrated with the intrinsic and extrinsic parameters.
