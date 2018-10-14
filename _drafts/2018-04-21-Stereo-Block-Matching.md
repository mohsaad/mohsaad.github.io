---
layout: post
title: A tutorial on Stereo Block Matching
---

So while I've covered single image depth prediction methods, I'd like to go back to a more established, geometrical way of obtaining depth maps of images. [Stereo](https://pdfs.semanticscholar.org/32ae/db3d4e52b879de9a7f28ee0ecee997003271.pdf) has been around for a long time, and is pretty widely used today in robotics problems. It allows you to establish the depth relatively easily, without having to resort to depth sensors or monocular-translation. In this tutorial, we'll learn about the most basic of stereo algorithms, basic block matching.

### Dataset

We'll be using the [Middlebury dataset](http://vision.middlebury.edu/stereo/data/scenes2005/) by Scharstein et al. for these images, specifically the Books image. These come in PNG images, which are really helpful for us, as we can load them into OpenCV easily.

### Finding the Disparity Map

The idea of stereo is that you can do depth estimation with two cameras that are aligned on the same baseline. Usually these two images look like this:

![Stereo Pair](http://www.bke.org/Bayreuth2005/Images/WagnerHeadStereoPairFull.gif)

You can see that the left image is slightly offset from the right image. We're first going to solve for a disparity map. The disparity map is simply the pixel-wise distance between the same region between two different views. Once we recover the disparity map, we can do more geometry to reconstruct the 3D scene itself.

The technique we're going to use for the disparity map is called block matching. The idea here is to match a block in one image with a block in another image with the same view. Let's assume the cameras are perfectly calibrated and aligned, so that the only difference between the two images is a small horizontal translation. Then, we can search for a single block from the left image in the right image on the same horizontal line
