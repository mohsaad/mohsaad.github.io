---
layout: post
title: Paper Review - Towards Geometric Deep SLAM
tags:
- research
- computer-vision
---

Another paper was bought to my attention by one of my co-workers. Published by Magic Leap scientists, it attempt to develop a SLAM algorithm based on deep learning. While such algorithms have been done (or at least parts of them, see [1] and [2]), the authors simplify the problem down to extracting corners and estimating a homography between two images with detected corners. The paper can be found [here](https://arxiv.org/pdf/1707.07410.pdf).

### Introduction

The paper starts off by referencing ImageNet, the highly successful image recognition challenge. With object recognition, creating a dataset is (comparatively) easy - get a bunch of people to hand-label images via Amazon MTurk, release a million labeled images, and start from there. With SLAM, it's harder - ground truth datasets are hard to collect, although they do exist ([3] and [4] come to mind). Once can try to render a photorealistic scene, but algorithms will often overfit the scene and not generalize well. The authors contend that full image-prediction is possible using deep nets, instead of using regression to estimate the homography matrix. The authors also bring up that full image prediction is not needed for SLAM, but rather only a couple points (one only needs to see LSD-SLAM [5] or ORB-SLAM [6] to know that's true - those methods don't estimate the entire depth map but rather parts of it, and yet they are very successful). The paper then introduces MagicPoint and MagicWarp, a corner estimation system and a homography estimation system.

### MagicPoint

The idea behind MagicPoint is that what we can do with conventional feature detectors, we can do much better with deep neural networks. We want to map an image $$I \rightarrow P$$ where $$P$$ is a full image of probabilities of "corner-ness", or how likely this pixel will be a corner. To do this, the authors use a VGG-like encoder to transform the image space into a cell grid representing the spatial positions, as seen in Figure 1. Afterwards, they drop the last dimension (which represents the probability of no corner being detected), run it through a softmax layer, and then reshape it back into a heatmap.

![MagicPoint network](http://mohsaad.com/imgs/magicpoint_arch.png)

To train the network, the authors generated a bunch of polygons of various sizes and dimensions, with ground truth corners known by the computer. They also warped, distorted, and brightened/dimmed the polygons to augment the training set. Doing this allowed them to mostly beat out conventional feature detectors, such as Harris/FAST/Shi-Tomasi corners, especially in images with lots of noise in them. The conventional feature detectors (especially Harris) still sometimes came up on top in ideal situations, such as prerendered data.

### MagicWarp

The objective behind MagicWarp is to, given two MagicPoint images, predict a 3x3 homography matrix that can be decomposed to find the pose or what other information you need. Allowing us to use MagicPoint images allows us to relax the constraint of photometric consistency, which means we no longer need to worry about illumination or shadows, as well as allowing us to reduce the dimensionality of the problem.

Again, the authors use a VGG-like encoder to transform the two MagicPoint images into a different feature space, then uses two fully-connected layers to infer the 9 parameters of the homography matrix. What is interesting is that they reshape the MagicPoint images into a 3D tensor and then concatenate them to feed into the network, instead of doing two separate networks for each stream. This allows them to relate the two images together and infer the actual homography solution. One possible way to improve the accuracy would be to interleave the two images in the tensor, allowing for possibly greater spatial pooling and faster feed-forwarding. One has to be careful with the network, as the FC layers have to be initialized with specific values for optimal results.

![MagicWarp network](http://mohsaad.com/imgs/magicwarp_arch.png)

To train, similarly to MagicPoint, the authors generated millions of point clouds. This time, they took several views of each of the point cloud, estimated the corners, and then discarded any with less than 30% overlap. They also used a form of dropout to ensure robustness to missing points.

MagicWarp, similarly to MagicPoint, does very well in solving for the homography, beating out the nearest neighbor classification with ease. However, I don't think this was a very strong test, as nearest neighbor is very weak. I would compare to other homography estimators and check MagicWarp's results against those.

### Conclusion

One last point I wanted to bring up was that MagicWarp and MagicPoint are very fast. For a 320x240 image, the point detection comes come out to 38.4 ms on a CPU. With a GPU, these results would likely be even faster. MagicWarp is much faster, taking only 6 ms to estimate a homography. Using these might be worth it for speed alone, although most handcrafted feature detectors might still be faster than the neural networks. Otherwise, it seems like there is still work to be done - training and running on real data instead of simulated ones could be a start.

### References

1. P. Fischer, A. Dosovitskiy, E. Ilg, P. Hausser, C. Hazirbas, V. Golkov, P. van der Smagt, D. Cremers, and T. Brox. Flownet: Learning optical flow with convolutional networks. In ICCV, 2015.

2. A. Kendall, M. Grimes, and R. Cipolla. Posenet: A convolutional network for real-time 6-dof camera relocalization. In ICCV, pages 2938–2946, 2015.

3. Silberman, N., Hoiem, D., Kohli, P. and Fergus, R., 2012. Indoor segmentation and support inference from rgbd images. Computer Vision–ECCV 2012, pp.746-760.

4. Song, S., Lichtenberg, S.P. and Xiao, J., 2015. Sun rgb-d: A rgb-d scene understanding benchmark suite. In Proceedings of the IEEE conference on computer vision and pattern recognition (pp. 567-576).

5. R. Mur-Artal, J. M. M. Montiel, and J. D. Tardos. Orb-slam: a versatile and accurate monocular slam system. IEEE Transactions on Robotics, 31(5):1147–1163, 2015.

6. J. Engel, T. Schöps, D. Cremers. LSD-SLAM: Large-scale direct monocular SLAM. European Conference on Computer Vision, pp. 834-849. Springer, Cham, 2014.
