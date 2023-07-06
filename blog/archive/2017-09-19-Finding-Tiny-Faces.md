---
layout: post
title: Paper Review&#58; Finding Tiny Faces
tags: [computer-vision, paper-review]
---

![TinyFace](http://www.cmu.edu/news/stories/archives/2017/march/images/tinyfaces-centipede_853x480-min.jpg)

I actually read this paper earlier in the summer, but it didn't really apply to any of the work I was doing until about now. This is an interesting paper out of Carnegie Mellon's Robotics Institute that utilizes a new characterization of scale to detect very small objects - or in this case, faces. Hu et al. make the case that scale-invariance will inherently make mistakes, as the process for detecting an object 3px wide is much different than detecting one 300px wide - an assertion that is supported by our own human eye. We don't use the same technique when looking at something large when looking at something small - we have to squint our eyes and try to make out the smaller object. Similarly to that, Hu and Ramanan train specific detectors for different scales in order to boost the detection/classification accuracy. The paper can be found [here](https://arxiv.org/pdf/1612.04402v1.pdf).

### Introduction and Related Work

A lot of work has been done in using scale-normalized classifiers, where they look for a specific image at various scales (see [1]). Others take advantage of deformable parts models [2]. With the advent of deep learning, now object detection has been in the realms of deep convolutional neural nets such as [3] and [4]. These still struggle with objects less than a certain size, necessitating a different approach for any small-scale object detection. Hu et al take advantage of a process called multi-task learning, which involves training different detectors for different tasks using similar information. More on that in a later section. Hu et al. also take advantage of context in the sense of looking at image regions around the actual object. Encoding these large regions into some kind of pattern is difficult, but Hu et al. look at a different kind of feature called hypercolumn features which serve as effective "foveal" features. At the end, they propose a 2x improvement to the existing methodology of face detection.

### Context vs resolution

Context is important for finding small faces, but let's pause for a second and look at the inverse problem: how do we find large faces of a fixed size? To do that, the authors focus on searching for the best template of a fixed-size image, treating the detection as a binary heatmap prediction problem. The authors use a ResNet [5] to extract features, looking at the outputs of each residual layer to represent multi-scale features.

One thing they noticed is that additional context usually helps, but not always. If we add more context to a small object, for exampl, it will hurt after a certain size (the authors say is 300x300). Using the "loose" RF (i.e. the template with a larger size than the target), on average, improves the detection rate of both large and small faces. This means that we can train specific detectors for different scales and take advantage of multi-task learning in order to perform face detection.

![Context Importance](https://www.cs.cmu.edu/~peiyunh/tiny/context_case.png)

One other aspect the paper authors covered is the question of resolution. In this section, they train a template on a size different than the target image - i.e. training a medium (50x40) template on a small face (25x20). At test time, they upsample the image by 2x. Doing this actually boosts the accuracy on the face detection a couple of percentage points! The same holds true for testing a medium template (125x100) on a large target (250x200), downsampled by 2. The reason for this is because of the distribution of object scales in the pre-training. Since most of the objects that the neural net trained on were of medium size, rescaling the face to the medium size will obviously boost the accuracy a little bit.

As a result of these findings, the authors decide to employ multi-task learning to train the detector.

### Multi-Task Learning

In short, multi-task learning involves learning how to do separate actions while sharing information that may be useful in accomplishing all of these tasks. In this case, the separate actions are really the different scale detections, while sharing information across scales between each of the specific detectors.

![Multi-Task Learning](https://lh5.googleusercontent.com/proxy/sO73QPC5gaMifWstSAwT2dhe9FCek7kXGuVq7H42ETL_QXL1xS3PSGR3Y7bRCbCDt3Gj-WPrEXzla0T4FDOR2g=w5000-h5000)

The algorithm they propose is to train a bunch of templates of faces at different resolutions, then select the ones that do the best across all scales. To define a template they use $$t(h,w,\sigma)$$ which is used to detect objects of size $$(h / \sigma, w / \sigma)$$ where $$\sigma$$ is the resolution. For each target, they try to find an optimal resolution $$\sigma_i$$ which will maximize the detection performance of the template $$t_i(\sigma_ih_i, \sigma_iw_i,\sigma_i)$$. In other words, they try to find a template that maximizes the success rate over all resolutions. They train separate multi-task models for each $$\sigma$$ and take the max to find the optimal resolution. One interesting thing they note is that you really only need 3 regimes. For large images ($$ > 140px$$), use 2x smaller resolution, for smaller images ($$ < 40px$$) use 2x larger resolution, and just use the same resolution for anything in between, where most objects fall.

### Architecture

The detection pipeline for finding faces is split into a 3-level image pyramid, which includes both a 2x upsampling space (for small faces) and a 2x downsampling space. We then feed them into 3 separate CNNs, which extracts the hypercolumnal features (important for context) and then predict response maps of the corresponding templates, generated from the multi-task learning above. Given those, we extract bounding boxes and then merge them back into a single image. For predicting the template response, they use both an A-type template (tuned for normal faces, 40-140px) and B-type template (tuned for <40px). The A-type is run on all 3 levels of the pyramid, while the B-type is only run on the 2x upsampled image, for detecting smaller faces. The CNNs were tested with ResNet-101, ResNet-50, and VGG-16, but performed the best with ResNet101.

### Results

![Results](https://www.cs.cmu.edu/~peiyunh/tiny/scale_examples.png)

From a visual inspection of the results, they look very promising. Even faces that I didn't think were possible were picked up by the detector.

The paper results say they have beaten prior approached by 17% on the hard set, while slightly outperforming the others on the Easy and Medium Set. It blows away any feature-based or non-Region Proposal Networks (which is what a lot of this work was based on), which is also good.

I decided to give it a try myself, using an implementation someone had written in MXNet (from [here](https://github.com/zzw1123/mxnet-finding-tiny-face)). However, it didn't exactly approach the results I saw in the paper, as can be seen below:

![Test Image](https://i.imgur.com/fkcP9KE.jpg)

There are probably more ways to accomplish this, including using more templates trained at a specific size, especially for the smaller faces.

### References

[1]&#58; Viola, Paul, and Michael J. Jones. "Robust real-time face detection." International journal of computer vision 57.2 (2004): 137-154.

[2]&#58; Dalal, Navneet, and Bill Triggs. "Histograms of oriented gradients for human detection." Computer Vision and Pattern Recognition, 2005. CVPR 2005. IEEE Computer Society Conference on. Vol. 1. IEEE, 2005.

[3]&#58; Girshick, Ross. "Fast r-cnn." Proceedings of the IEEE international conference on computer vision. 2015.

[4]&#58; Redmon, Joseph, and Ali Farhadi. "YOLO9000: better, faster, stronger." arXiv preprint arXiv:1612.08242 (2016).

[5]&#58; He, Kaiming, et al. "Deep residual learning for image recognition." Proceedings of the IEEE conference on computer vision and pattern recognition. 2016.
