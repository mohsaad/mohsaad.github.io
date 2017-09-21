---
layout: post
title: Paper Review&#58; Finding Tiny Faces
tags: computer-vision, research
---

I actually read this paper earlier in the summer, but it didn't really apply to any of the work I was doing until about now. This is an interesting paper out of Carengie Mellon's Robotics Institute that utilizes a new characterization of scale to detect very small objects - or in this case, faces. Hu et al. make the case that scale-invariance will inherently make mistakes, as the process for detecting an object 3px wide is much different than detecting one 300px wide - an assertion that is supported by our own human eye. We don't use the same technique when looking at something large when looking at something small - we have to squint our eyes and try to make out the smaller object. Similarly to that, Hu and Ramanan train specific detectors for different scales in order to boost the detection/classification accuracy. The paper can be found [here](https://arxiv.org/pdf/1612.04402v1.pdf).

### Introduction and Related Work

A lot of work has been done in using scale-normalized classifiers, where they look for a specific image at various scales (see [1]). Others take advantage of deformable parts models [2]. With the advent of deep learning, now object detection has been in the realms of deep convolutional neural nets such as [3] and [4]. These still struggle with objects less than a certain size, necessitating a different approach for any small-scale object detection. Hu et al take advantage of a process called multi-task learning, which involves training different detectors for different tasks using similar information. More on that in a later section. Hu et al. also take advantage of context in the sense of looking at image regions around the actual object. Encoding these large regions into some kind of pattern is difficult, but Hu et al. look at a different kind of feature called hypercolumn features which serve as effective "foveal" features. At the end, they propose a 2x improvement to the existing methodology of face detection.

### Context vs resolution

Context is important for finding small faces, but let's pause for a second and look at the inverse problem: how do we find large faces of a fixed size? To do that, the authors focus on searching for the best template of a fixed-size image, treating the detection as a binary heatmap prediciton problem. The authors use a ResNet [5] to extract features, looking at the outputs of each residual layer to represent multi-scale features.

One thing they noticed is that additional context usually helps, but not always. If we add more context to a small object, for exampl, it will hurt after a certain size (the authors say is 300x300). Using the "loose" RF (i.e. the template with a larger size than the target), on average, improves the detection rate of both large and small faces.
