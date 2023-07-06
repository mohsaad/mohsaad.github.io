---
layout: post
title: Summary of Single Image Depth Prediction Papers
tags: [paper-review, computer-vision, tutorials]
---

Single Image Depth Prediction is a relatively new field, as most monocular depth-prediction algorithms either require some translation or an actual depth sensor in order to establish a baseline we can use to estimate the actual depth map. With the [KITTI competition now having a Depth Prediction category](http://www.cvlibs.net/datasets/kitti/eval_depth.php?benchmark=depth_prediction), I thought it would be a good idea to review some of the literature in the field.

### Depth Map Prediction from a Single Image using a Multi-Scale Deep Network

##### David Eigen, Christian Puhrsch, Rob Fergus

[NIPS 2014](https://papers.nips.cc/paper/5539-depth-map-prediction-from-a-single-image-using-a-multi-scale-deep-network.pdf)

The original paper by Eigen et al. is the first that I know of that tries to straight up learn the depth representation of an indoor scene via convolutional neural networks. What's interesting to see is that they branch off their original input into two paths: one learning a "coarse" input which is then used to refine a more "fine" depth image. What's also interesting is that there are no up-pooling or deconv layers to make the image larger from a smaller representation. It seems like a very simple, not horribly complex network like some of the later ones (looking at you, Deeper Depth Prediction).

![Depth-Prediction-Multi-Scale](http://img.blog.csdn.net/20150426214556452)

One thing to note is that this network uses the full NYU v2 training set, which requires training the network for a long time before seeing any results. They say in the paper that it took just over 2.5 days to train both the coarse and fine network! With today's technology and frameworks, that certainly can come down.

What's interesting to see is that the "coarse" + "fine" network is a larger example of a residual network that was used in later papers (Laina et al). It seems like a good way to get good results is to concatenate feature maps at a higher level with a "coarse" estimation, which allows for a sense of feature sharing between the networks. The results look... okay, not the best. One thing that does intrigue me is that training on the KITTI dataset does do pretty well, making it a possibility for use with things like self-driving cars.

### Depth and surface normal estimation from monocular images using regression on deep features and hierarchical CRFs

##### Bo Li, Chunhua Shen, Yuchao Dai, Anton van den Hengel, Mingyi He

[CVPR 2015](http://users.cecs.anu.edu.au/~yuchao/files/Li_Depth_and_Surface_2015_CVPR_paper.pdf)


Instead of using just deep networks to predict the depth, this paper instead uses a couple of methods to improve the accuracy of its depth maps. The algorithm first obtains super-pixels from the input image, and for each super-pixel, extract patches at various scales around the center of the super-pixel. A neural net then learns the relationship between the patches and the depth map. After this depth map is estimated, the authors use a CRF to relate the depth from the super-pixel level to the pixel-level.

The deep network takes in patches extracted by the super-pixel algorithm ([SLIC](http://www.kev-smith.com/papers/SLIC_Superpixels.pdf)) and use them to predict depth of the super-pixel patches. The network's weight is transferred from AlexNet, and then use transfer learning to learn the weights of the final fully-connected layer. The paper notes that the performance of the system improves by using larger patches, as more global context is encoded/learned into the deep network as we forward it through.

After the deep network predicts a depth map, we refine it and make it better using a hierarchical conditional random field to regress the super-pixel depth patch down to a pixel depth. There's a lot of math here, and I don't fully understand it, so I'm going to skip it for now and save it for when I do a full paper review.

As for the results, at least on NYU v2, it does seem to outperform them, at least qualitatively. One interesting thing to note is they did evaluate a model trained on NYUv2 on images not in the dataset, and the results looked very good qualitatively. This surprised me, as the depth trained and evaluated on an indoor scene should be completely different when evaluated on an outdoor scene. But it looks good, at least while looking at it. It would be interested to implement this paper and see what it would look like on KITTI.

### Deeper Depth Prediction using Fully Convolutional Residual Networks

##### Iro Laina, Christian Rupprecht, Vasileos Belagiannis, Federico Tombari, Nassir Navab

[Arxiv](https://arxiv.org/abs/1606.00373)


This paper takes advantage of He et al's [Residual Networks](https://arxiv.org/pdf/1512.03385.pdf) in order to learn and predict depth maps from single images. It makes sense, however - a lot of the previous work we covered above use skips and other ways to learn global context in order to introduce information from higher levels into the lowest layers of the deep network. Laina et al. have a simple thesis - use residual layers to concatenate the higher levels after processing them through several convolutional layers, do that a bunch of times, and invent a new block that allows you to get rid of an expensive up-pooling layer.

![Deeper Depth Prediction](https://sites.google.com/site/yorkyuhuang/_/rsrc/1496983719267/home/research/machine-learning-information-retrieval/disparityestimationbydeeplearning/DeepDepthPrediction.jpg?width=1000)

To do this, we stack a lot of residual and projection blocks in order to learn high-level features, and then use a method called up-projection to remove the expensive step of up-pooling. All these layers are convolutional, with only one pooling layer in the very beginning. As a result, this network has a magnitude lower amount of weights, which makes it much quicker to train.

The up-projection block is interesting - to upsample the learned map, we convolve the input feature map with four separate filters, and then concatenate and interleave them to get an equivalent of the up-pooling layer. This results in a much faster way to do the unpooling. Chaining together a couple of these blocks allows the information to pass through while also increasing the feature maps.

The results are very exciting. With this, we see a lot more detailed features than the other two previous papers, such as the depth difference between various objects and their backgrounds. One other notable feature is the speed. Predicting a single image takes only 55ms on a GPU with cuDNN, which is a vast improvement over other algorithms, which could take much longer. The fully-convolutional aspect means we have less parameters to tune. In addition, this model takes far fewer images to train - only about 120k images compare to several million for Eigen et al. and 800k for the Li et al.

As a shameless bit of self-promotion, I implemented this paper in PyTorch, you can find it [here](http://github.com/mohsaad/Deeper-Depth-Prediction).

### Unsupervised Monocular Depth Estimation with Left-Right Consistency

##### Clement Godard, Oisin Mac Aodha, Gabriel J. Brostow

[Arxiv](https://arxiv.org/pdf/1609.03677.pdf)

While the other three papers we have looked at are supervised methods, i.e. they require vast amounts of training data that is labeled, this method is completely unsupervised, which makes it all the more interesting. Theoretically, you don't require any labeled data for an unsupervised method - you plug it in and go.

This paper aims to try and provide an unsupervised method for generating depth maps. Instead of trying to predict or regress a depth image from a color one, the authors instead try to generate / reconstruct a depth image from a color image. Here, we try to infer a correspondence that, given the left image, will allow us to reconstruct the right image and from there, the depth map.

The network itself is an encoder-decoder network, which allows it to learn the warping between a left-right and right-left image. While training, the network learns to generate an image from the opposite stereo image, using a combination of L1 and SSIM loss to measure the reconstruction error. They also optimize for the display smoothness and the left-right consistency for a more accurate depth map. Training on left-right stereo pairs, the network doesn't need any labeled ground truth data, and can instead rely on stereo datasets, of which there are many.

The results are quite impressive. The network runs at 35ms/image, which is faster than Laina et al. The results, especially on the KITTI datasets, are similarly impressive. There are much better depth map reconstructions than Eigen et al, allowsing us to see individual cars not able to be seen before. The network also generalizes well to other datasets, and outperforms Laina et al on the Make3D dataset. There are a few limitations, such as artifacts at occlusions and specular reflections. Overall however, this is an interesting and possibly easier method to estimate depth without having loads of ground truth data.

![Unsupervised Depth prediction](https://i2.wp.com/pbs.twimg.com/media/Cst0rRLWEAAWhHd.jpg?w=840&ssl=1)

Overall, depth prediction is a growing field, and I look forward to more research coming in 2018!
