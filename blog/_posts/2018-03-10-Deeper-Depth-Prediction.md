---
layout: post
title: Paper Review&#58; Deeper Depth Prediction using Fully Convolutional Residual Networks
tags: [paper-review, computer-vision]
---

Single image depth prediction is a small but growing field of computer vision research. Normally, depth prediction is done in one of two ways:

1. Stereo images with a baseline and image correspondence to solve for a homography to estimate the disparity map, at which point the depth map can be estimated
2. A single camera with an accelerometer attempting to estimate camera movement between frames to create a stereo correspondence
3. A depth sensor (structured light / LiDaR / infrared) to extract a depth image

Each of these have their constraints. Stereo is usually pretty accessibly, but requires two cameras and is not the best for small platforms. Single camera depth systems usually estimate scale very badly, and as a result produce depth images that are wholly inaccurate. Depth sensors usually don't work well outdoors or for very long range environments.

This paper by Laina et al. attempts to learn and predict a depth map from a single image, using a large amount of labeled depth maps with color images associated with it. While normally I would jump and say "you can't estimate depth with a single image! Just close your eye and wait 5 minutes!" I'm actually inclined to think it may be possible. Even when looking at a single image, you can infer specific things that can help you infer the depth of a scene. The only problem is that you may not be able to estimate scale very well. The paper can be found [here](https://arxiv.org/pdf/1606.00373.pdf). My code for this paper can be found [here](https://github.com/mohsaad/Deeper-Depth-Prediction).

### Related work

Previous approaches usually involve using handcrafted features with graphical models to estimate the depth, making a lot of assumptions about the geometry of the scene, which _usually_ doesn't work in real life. In recent years, Eigen et al. in 2014 showed the deep learning can estimate the depth map, by developing a CNN trained with AlexNet to do exactly that. Liu et al. also tried this, but added a conditional random field (CRF) to refine the predictions from a patch-level to the actual pixel.

### Architecture

![Deeper Depth Prediction](https://sites.google.com/site/yorkyuhuang/_/rsrc/1496983719267/home/research/machine-learning-information-retrieval/disparityestimationbydeeplearning/DeepDepthPrediction.jpg?width=1000)

The network architecture differs from the previous attempts at single-image depth estimation. Instead of a series of layers where the output progressively gets smaller until we reach a final size, we instead use convolutional layers arranged in residual and projection blocks (with skips) to contract the image down to a certain size, and then use a new block called an up-projection block to regress the image back up to the size of the output depth map. The method is fully-convolutional without any need for fully-connected layers, which are good but very expensive to train.

The paper takes full advantage of several stacks of residual blocks to combine high-level and lower-level features. These residual blocks improve the accuracy of the overall network. Since the network is fully-convolutional, it has many less parameters than a fully-connected layer might (in the paper, they mention that a fully-connected network of the same size would have 3.3 billion parameters, or 12.6 GB worth... a lot). After the contraction portion, the network upsamples the learned information using a series of "Up-Projection" blocks. These blocks are meant to replace the unpooling operating, which is fairly inefficient and slow. The "Up-Projection" block contains two branches, filtered with 4 convolution layers with kernel sizes 3x3, 3x2, 2x3, 2x2, which are then combined using an interleaving operation that renders it functionally identical to the unpooling operation. Chaining these blocks together allows for increased passing of information while also upsampling the resulting depth map to our indented output size.

![Imgur](https://i.imgur.com/rV13Kxz.png)

The interleaving portion is a bit difficult to understand, but the gist of it is that we can map the essential calculations (i.e. those that don't result in 0) into 4 filters with the 4 kernel sizes described above. Afterwards, we can interleave the four resulting outputs into our single output without a loss in accuracy.

The authors use the reverse Huber function (called berHu). While $$L_2$$ loss is notmally used, the authors found that the berHu loss works better in their test cases. The berHu loss function is as follows:

$$B(x) =
            \left\{
            \begin{array}{ll}
            \lvert x\rvert & \lvert x\rvert \leq c,\\
            \frac{x^2 + c^2}{2c} & \lvert x\rvert > c
            \end{array}
            \right.
$$

### Results

For a fully-convolutional network, the results are impressive. The network was trained on NYU v2, an indoor dataset. There are still quite a few artifacts in the resulting depth image, but the overall result is still much improved from previous approaches. One thing to note is that this network was trained end-to-end, but still gets fairly equivalent results with other methods that also use CRF's for post-processing.

![Imgur](https://i.imgur.com/dOUDoe1.png)

I actually did implement this paper myself in PyTorch. The original code was written in [Tensorflow](https://github.com/iro-cp/FCRN-DepthPrediction). I rewrote in in PyTorch and tested it myself. In my CPU experiments with the NYU v2 dataset, I got pretty good results. One interesting thing to note is that the wall actually came out pretty well in the depth image, which is surprising - feature-based methods don't work at all with feature-less surfaces. With convolutional nets, I think you can do very well without many features. My code can be found [here](https://github.com/mohsaad/Deeper-Depth-Prediction).

![Color Image](https://i.imgur.com/1KcoXXD.jpg)

Color Image.

![Depth Image](https://i.imgur.com/ppofMtX.jpg)

Depth Image.

### Future work

I will be working on depth-prediction for the near future. One thing I do want to do is run this network on a GPU, then also on a Jetson TX1. I think there's things to be said about doing depth-prediction in real-time, and then integrating it into a full system. The authors mentioned that they had tried this system with RGB-D SLAM, with promising results. In fact, they came out with their own SLAM system a bit later, called [CNN-SLAM](https://arxiv.org/pdf/1704.03489.pdf). My next couple of weeks will be focused on implementing various depth prediction methods, and also gaining an understanding of SLAM in order to integrate these depth prediction systems for monocular SLAM.
