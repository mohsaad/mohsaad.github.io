---
layout: post
title: Paper Review&#58; Automatic Targetless Extrinsic Calibration of a 3D Lidar and Camera by Maximizing Mutual Information
tags: [paper-review, computer-vision]
---
$$\DeclareMathOperator*{\argmax}{arg\,max}$$

Turning towards some robotics algorithms for a bit, we're coming across a problem that is sorely needed for almost every self-driving car - the issue of calibration. Today we'll be focusing on camera-LIDAR calibration, which is essential if you want to utilize multiple sources of information for your car. Usually, these kinds of approaches require a target to work well, and is usually pretty easy. [1](https://www.ri.cmu.edu/pub_files/2012/10/alismail_3dimpvt_2012.pdf). However, it's quite easy to bump the camera, or otherwise change the camera such that it needs a recalibration. For a car especially, this can happen quite often with wind or what not. A targetless calibration is what is ideally needed for this, as then you would not need to drive into a garage somewhere to re-calibrate.

This paper by Pandey et al. allows for that, by creating a system in which the car just needs to drive around without any specific targets. Ideally, one can just drive around and collect a bunch of data, then run this procedure to re-check the calibrations. The way this method works is by taking advantage of mutual information in the Lidar frame and the camera frame. The paper can be found [here](http://robots.engin.umich.edu/publications/gpandey-2012a.pdf).

## Theory

Let's define two random variables $$X$$ and $$Y$$, which represent the laser reflectivity value (or intensity of the laser beam) and the corresponding greyscale value of the pixel in this associated image. In this case, both $$X$$ and $$Y$$ contain some mutual information - i.e. a lane marking, a tree, a person walking along, etc. We can call this mutual information $$MI(X,Y)$$. Let's have $${P_i; i = 1,2,\dots,n}$$ be the set of 3D points and $${X_i; i = 1,2,\dots,n}$$ be the corresponding reflectivity values for those points. Let's also define $$p(X)$$, $$p(y)$$, $$p(x,y)$$ as the marginal and joint probabilities of those random variables.

For a pinhole camera model, we can express the relationship between a 3D point and it's image projection with the formula:

<div>$$p_i = K [R | \bf{t}]P_i$$</div>

Where $$K$$ are our camera intrinsic parameters (distortion + focal/camera center), $$p_i$$ is the image pixel and $$P_i$$ defined above. We are really trying to estimate $$R$$ (rotation in Euler angles) and $$\bf{t}$$ (translation in meters). We can also let $${Y_i; i = 1,2,\dots,n}$$ be the greyscale image intensity value where the 3d point projects onto. Essentially, $$Y_i$$ represents the image pixel of $$p_i$$.

What we need to do is build up a histogram called the kernel density estimate (KDE) to give us a good estimate of our marginal and joint probabilities. To do that, we just bin each of our image intensities and our laser intensities, then apply the following to get our joint probabilities:

$$p(X,Y) = \frac{1}{n} \sum_{i=1}^n K_{\Omega} (\begin{bmatrix}X\\Y\end{bmatrix} - \begin{bmatrix}X_i\\Y_i\end{bmatrix})$$

Here $$K$$ is a symmetric kernel, while $$\Omega$$ is the smoothing factor of the kernel. We can visualize the effect of the kernel with the following image:

![Imguri](https://i.imgur.com/tXxdIQr.png)

Once we have our joint probability distribution, all we need is to optimize for the mutual information. In this case, we define mutual information as the overlap between entropies of two variables:

$$MI(X,Y) = H(X) + H(Y) - H(X,Y)$$

Where

$$H(X) = -\sum_{x \in X} p_X(x)\log p_X(x)$$

$$H(Y) = -\sum_{y \in Y} p_Y(y)\log p_Y(y)$$

$$H(X,Y) = -\sum_{x \in X}\sum_{y \in Y} p_X(x,y)\log p_{XY}(x,y)$$

Now, we can maximize an objective function:

$$\hat{\Theta} = \argmax_{\Theta} MI(X,Y; \Theta)$$

The maxima is the rotation and translation parameters that maximize this objective function.

## Optimization

The authors use Barzilai-Borwein steepest gradient ascent to find the $$\Theta$$ that maximizes the above equation. Given the gradient of the cost function $$\hat{\Theta}$$, we can write the gradient as:

$$G = \nabla MI(X,Y; \Theta)$$

and one iteration as

$$\Theta_{k+1} = \Theta_k + \gamma_k \frac{G_k}{||G_k||}$$

Here, $$\gamma_k$$ represents the adaptive step size of the iteration, which is given by

$$\gamma_k = \frac{s_k^T s_k}{s_k^Tg_k}, s_k = \Theta_k - \Theta_{k-1}, g_k = G_k - G_{k-1}$$

Since this is convex, we see that this will converge after a few iterations depending on the number of scans. An image of the cost surface can be seen below:

![Imgur](https://i.imgur.com/xWTMq33.png)

## Results

### Single Scan

With a single scan, we run into the issue of data reliability. With an outdoor dataset, we didn't have many near-field objects, and as a result our calibration suffered. This is because points close to infinity in the image plane have a lot of variance in translation, as there is not much difference in their image projections. So we definitely need some kind of close objects for an accurate calibration.

### Multiple scan

While the calibration procedure may not work well for a single scan, doing multiple LIDAR scans and aggregating the scans into an optimization batch will give us a lot less variance in the calibration parameters, according to the CLRB bound.

## Future Work

Using other sensor modalities (not just cameras and LIDARs) may also help with giving an accurate result. Utilizing a depth-prediction algorithm as another modaility comes to mind - it could help improve the accuracy of the single scan method.
