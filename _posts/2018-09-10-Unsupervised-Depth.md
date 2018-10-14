---
layout: post
title: Paper Review&#58; Unsupervised Monocular Depth Prediction with Left-Right Consistency
---

A lot of the current depth estimation algorithms that use deep learning are [feed-forward]() or [regression]() algorithms. This means that given a single image, the network will either reduce the dimensionality of the color image to create a depth image or predict a depth image based on the weights. Both of these approaches require tons of training data to get correct, as they need to refine the weights over several thousands of epochs. This paper takes an "unsupervised" approach to depth estimation. Instead of trying to estimate the depth image from a single image and regressing, Godard et al. decided to try and infer the depth map from a single image by generating another image and getting the depth map from that.

For a little bit of context, most depth maps pre-deep learning were done by stereo estimatiom. This paper aims to generate a left or a right image and create a stereo pair, allowing us to estimate the depth map easier. Since this image synthesis can have various artifacts in the generated depth map, the authors also include a left-right consistency check to ensure that the generated and original image are, in fact, closely related. The paper can be found [here](http://openaccess.thecvf.com/content_cvpr_2017/papers/Godard_Unsupervised_Monocular_Depth_CVPR_2017_paper.pdf),

## Related Work

Most previous depth estimation via deep learning methods were done by learning a depth map from a single image, combining other features or using an advanced loss function to compensate for depth anomalies. However, utilizing other features in addition to learning the depth means you will have to tune those features to a dataset, and they may not be transferable to other environments. (This usually goes for all feature-based methods). The issue with supervised methods for single image depth prediction is that they require tons of training data and time to get right, especially since true depth is hard to obtain and sometimes wholly inaccurate.

The closest approaches to Goddard et al.'s work is an algorithm called [DeepStereo]() which aims to reconstruct an image based on poses of images close to it. However, this requires the entire dataset to be available at test time, which is not ideal for us. Other approaches are fairly similar, in that they generate a left or right view from their image to generate a stereo pair, which we can then use for stereo matching. One such approach is called Deep3D, which uses an image reconstruction loss to produce a distribution over all possible disparities in the left image. The issue with this is that it does not scale well with increasing disparities, and becomes increasingly memory-inefficient. Garg et al. use somthing very similar to the Goddard et al., but their training loss is very tricky to optimize.

## Methodology

Normally most depth prediction problems are set up as supervised learning problems, meaning that they're just normal deep learning. You set up an architecture and your training loss, and just feed in data until it dies. However, the authors use a slightly different approach using two images. At training time, instead of having a color-depth pair or a color-lidar pair, we instead have a left-right image pair $$I$$ and $$I'$$. The idea is to set up a loss that that can reconstruct the left or right image while still being consistent with each other.

### Loss Function

The training loss is split into three portions:

* $$C_{ap}$$ - Encourages the reconstructed input to be similar to the corresponding training input
* $$C_{ds}$$ - Encourages smooth disparities
* $$C_{lr}$$ - Makes left and right disparities consistent with each other

We have a loss at each scale $$s$$ in order to handle different resolutions. The resulting loss function per scale is:

$$C_s = \alpha_{ap}(C^l_{ap} + C^r_{ap}) + \alpha_{ds}(C^l_{ds} + C^r_{ds}) + \alpha_{lr}(C^l_{lr} + C^r_{lr})$$

The total training loss is then (after accounting for multiple scales) is:

$$C = \sum_{s=1}^4 \lambda_s C_s$$

Let's dig into each of these training losses.

#### Appearance Matching Function

The network will generate an image by sampling pixels from the opposite image. To do that, we use an image sampler from the spatial transformer network, which uses bilinear sampling. This means that a sampled pixel is really just the average of it's 4 direct neighbors. However, this means that the network is fully differentiable, unlike Deep3D. This is incorporated into the appearance loss, below:


$$C_{ap}^l = \frac{1}{N} \sum_{i,j} \alpha \frac{1 - SSIM(I_{j}^{l}, \tilde{I}_{i,j}^{l})}{2 + (1 - \alpha)||I^l_{ij} - \tilde{I}^l_{ij}||}$$

In this case, SSIM refers to a 3x3 block filter and set $$\alpha = 0.85$$. Here, we are really integrating an L1 loss between our input image and the photometric reconstruction. The nice thing about this is that this function is fully diffentiable, meaning that there are no linearizations or simiplifications that need to take place.

#### Disparity Smoothness Loss

The authors enforce the disparities to be smooth to eliminate any discontinuities on the image. To minimize anty discontinuities, the authors weight the cost with an edge aware term to catch any bad disparity estimations.

$$C^{l}_{ds} = \frac{1}{N} \sum_{i,j} \partial_{x}d_{ij}^{l}|exp(-\eta ||\partial{d}_{x}I^{l}_{ij}||) + |\partial_{y}d_{ij}^{l}|exp(-\eta ||\partial_{y}I^{l}_{ij}||)$$

#### Left-Right Disparity Consistency Loss

While we can rely on the network to predict a depth map decently, we need to include a consistency check to make sure that the left and right images actually kind of look like the left and right images. To do this, we include a third term in our loss function:

$$C^l_{lr} = \frac{1}{N} \sum_{ij} |d^l_{ij} - d^r_{ij + d^i_{ij}}|$$

This term penalizes any difference in disparity between the left image and the right projected image with an L1 loss.

### Training Parameters

The authors trained in Torch on 2x Titan X GPUs on 30k images (much less than Laina et al) for 50 epochs. The network performs inference at around 20 fps, which is almost real time! The original training time took 50 epochs, with a batch size of 8 images/batch.

The output disparities were constrained between 0 and $$d_max$$ using a sigmoid function, where $$d_{max} = 0.3 \times w_{image}$$. The authors also used exponential linear units instead of rectified linear units, because the ReLUs tended to prematurely fix the predicted disparities at the intermediate scale to a fixed value, which prevented the network from improving. The authors replaced the deconvolution with nearest neighbor upsamping with additional convolutions.

Data augmentation mainly consisted of image flipping (50% chance), sampling color augmentations involving gamma, brightness, and each color channel.

The network layers can be seen in this table:

![Imgur](https://i.imgur.com/Bxe53Nz.png)

## Results

So the results look pretty neat for a method that is very different from most depth prediction algorithms. For example, an input image versus it's estimated depth map.

![Imgur](https://i.imgur.com/6tGFXHv.png)

One really interesting thing about this paper is how well it generalizes to other datasets. The authors tried a model trained on KITTI on CityScapes, with comparable performance. Some screenshots can be found below:

![Imgur](https://i.imgur.com/YU3okw8.png)

Artifacts still do occur, especially at occlusion boundaries that are visible in both images. Another issue is that you can't really use single-view datasets for training, which reduces the amount of in-flow data (but considering the number of stereo datasets, this isn't that huge of an issue). Specular and transparent surfaces will also cause bad data readings, as the reconstruction cannot handle them.

## Future Work

There were a couple papers on CVPR 2018 approaching this, but I think this is pretty close to state-of-the-art even 1 year later. the fact that it's extensible, works in near-real-time, and doesn't require expensive mono depth datasets is enough to put it near the top. However, some things like temporal consistency and sparse input could help improve the algorithm, as well as a pipeline for semantic segmentation could be useful.
