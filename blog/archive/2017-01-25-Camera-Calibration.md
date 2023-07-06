---
layout: post
title: Camera Calibration
tags: [tutorials]
---
This is the first of a two-part series on camera calibration, which I relearned all about during the last few days.

## What is camera calibration?

In an image, we often want to infer how far away something is, and to correct for any distortions the camera might have. In applications like SLAM or Structure from Motion, it is essential that a monocular or stereo camera system have some way to infer depth, and the backbone of these depth measurements is a camera calibration.

## How do you do it?

There are two parts to camera calibration:

1. Image Rectification - this is inferring the mapping between the 3D world (our world) and the image plane (the 2D image we see).

2. Distortion correction - taking an image and making straight lines in the real world straight lines in our image

### Image Rectification

#### The Pinhole Model of a Camera
The simplest kind of camera model is the pinhole model. This assumes that light is captured through a small "hole" in front of the CCD, and that the image can be described as a scaled rectangle (or circle, depending on the CCD pixel type). It also allows us to treat the camera as a single point in our coordinate spaces.

Note that pinhole [cameras actually do exist](https://en.wikipedia.org/wiki/Pinhole_camera) and you can make one!

Time for some math. Let the camera center $$\bf{C}$$ be the origin of our coordinate system (the camera frame) and a point $$\bf{X} = (X,Y,Z)^T$$ be a point in the world past the camera (but still in our camera coordinate system). Now let's define the image plane at $$z = f$$. This is the image we take of our world, with $\bf{X}$ inside it. Here's a quick picture of it, from Multiple View Geometry by Hartley/Zisserman (Ch. 6 pg. 154).

![Camera Pinhole Model](http://mohsaad.com/imgs/camera_pinhole_model.png)

From this, we know that there must be a ray (analogous to a light ray) that intersects the plane $$z = f$$ at some point $$\bf{x}$$ and passes through $$\bf{X}$$. In our camera coordinate system, these two points form similar triangles, so $$\bf{x} = (\frac{f}{Z}X, \frac{f}{Z}Y, f)^T$$

Typically we express the two vectors $$\bf{X}$$ and $$\bf{x}$$ in homogenous coordinates.

#### Homogenous Coordinates

Homogenous coordinates allow us to express points at infinity in a coordinate system. In a projective plane, parallel lines are allowed to intersect, but at infinity.

For any point $$(x,y)$$ on a Euclidean plane, we can express it's homogenous coordinate as $$(xZ, yZ, Z)$$ where Z is a non-zero real number. For example, a Cartesian coordinate $$(3,4)$$ can be expressed as $$(3,4,1)$$, and is equivalent to $$(6,8,2)$$ in homogenous coordinates. We can also convert back to the original Cartesian coordinates by dividing by the third coordinate, such that the original coordinate is $$(\frac{x}{Z}, \frac{y}{Z})$$.

Now, say we have a line going to infinity. (Like all lines). We can parameterize the line as $$x = mt, y = nt$$, so that $$z = \frac{1}{t}$$ as $$t\rightarrow \infty$$, $$Z \rightarrow 0$$, so that a point at infinity is represented by $$Z = 0$$. This allows the homogenous coordinates of the point to become $$(m, n, 0)$$ and intersect with all other points at infinity.
