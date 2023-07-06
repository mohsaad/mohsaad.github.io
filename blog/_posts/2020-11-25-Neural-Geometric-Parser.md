---
layout: post
title: Paper Review &#58; Neural Geometric Parser for Single Image Camera Calibration
description: A summary of a new method on single image camera calibration
tags: [paper-review]
---

# Neural Geometric Parser for Single Image Camera Calibration

[Link to paper](https://arxiv.org/pdf/2007.11855v2.pdf)

This paper was published at CVPR 2020, and it caught my eye. It's an interesting method, and I learned a lot from reading it.

# Goals

- Learn camera intrinsic parameters
    - focal length
    - rotation angle (roll, pitch, yaw)

# Related work

- UprightNet
- DeepFocal / DeepHorizon
    - Estimates horizon lines using semantic analyses of images with neural nets
    - Non-trivial to estimate VPs from network inference results
- NeurVPS
    - Assumes normalized focal lengths
- CONSAC
    - Supervision of all VPs

# Assumptions / Abstractions

- Use man-made scenes

# Problem Formulation

- Leverage line segments to reason camera parameters
- Line segments are used as an input - assumes we have a bunch of line segmenets
- Manhattan world assumption
    - Calibration can be done once we have the Manhattan directions
    - 3 vanishing points / intersections that represent x,y,z directions in 3d
- Use LSD as a line segment detector
- Each image is transformed into a psuedo camera space as $$\bf{p} = \bf{K}_p^{-1}(p_x, p_y, p_z)^T$$
    - $$\bf{K}_p$$ is a psuedo camera intrinsic matrix
        - $$f = \min(W, H)/ 2$$

# Solution / Methodology

We have two networks: one network to estimate the vanishing point in the z-direction, and one to estimate the camera intrinsic parameters.

![Neural%20Geometric%20Parser%20for%20Single%20Image%20Camera%20Ca%2043559b6975a847a3b4b15b0830114b78/Untitled.png]({{site.blog_url}}/assets/posts/neural-geometric-parser/network.png)

## ZSNet (Zenith Scoring Network)

### Getting zenith candidates

- Takes in a set of unordered vectors in 2D homogenous coordinates (line equations / VPs)
- Sample a set of line equations roughly directed to the zenith using the following equation:

$$|\tan^{-1}(-\frac{a}{b})| > \tan^{-1}(\delta_z)$$

- $$I = (a,b,c)^T$$ is a line equation and $$\delta_z = 67.5^{\circ}$$
- We obtain a set of line equations from our image and accumulate in the set $$L_z$$
- Then, we randomly select pairs of lines from $$L_z$$ and compute vanishing points, and add to the set $$Z$$
    - Both $$L_z$$ and $$Z$$ have 256 samples inside them
- The goal of ZSNet is to score each zenith candidate in $$Z$$ (1 if good, 0, otherwise)

### PointNet

- Each point processed independently to get point-wise features
- Global max-pool applied to aggregate all the features and generate global feature
- Global point concatenated to each point, then classified

### Scoring zenith candidates

- Feed each candidate in $$Z$$ to the Pointnet feature extractor ($$h_z(.)$$)
- Feed each candidate in $$L_z$$ to PointNet ($$h_l(.)$$)
- Instead of computing global feature from $$Z$$, use the $$L_z$$  features as the global feature that is concatenated to each of the features from $$h_z$$
- Essentially, the operation becomes:

$$g_l = \text{gpool}(h_l(L_z))\\
h'_z(z_i) = g_l \otimes h_z(z_i)$$

- Concatenated features are fed into a scoring network with a bunch of linear layers and a sigmoid at the end
- Select zenith candidates with scores that are larger than 0.5

### Training ZSNet

- Assign a ground truth label to each zenith candidate $$z_i$$ using:

$$y_i =\begin{cases}1 & \text{if cossim}(z_i, z_{gt}) > \cos(\delta_p)\\
0 & \text{if cossim}(z_i, z_{gt}) < \cos(\delta_n)\end{cases}\\
\text{cossim}(x,y) = \frac{||xy||}{||x||||y||}\\
\delta_p = 2^{\circ}, \delta_n = 5^{\circ}$$

- Loss function:

$$\mathcal{L}_{cls} = \frac{1}{N}\sum_i^N -y_i \log(p_{z_i})$$

- Constrain the weighted average of zenith candidates close to the ground truth
- Given some homogeneous points, we compute a structure tensor:

$$ST(v) = \frac{1}{v_x^2 + v_y^2 + v_z^2}\begin{bmatrix}v_x^2 & v_xv_y & v_x v_w\\
v_x v_y & v_y^2 & v_y v_w\\
v_x v_w & v_y v_w & v_w^2\end{bmatrix}\\
\\
\bar{ST}(z) = \frac{\sum_i p_{z_i} ST(z_i)}{\sum_i p_{z_i}}\\
\\
 
\\
\mathcal{L}_{loc} = ||ST(z_{gt}) - \bar{ST}(z)||_F$$

## Frame Scoring Network (FSNet)

### Estimating the other two vanishing points

- Filter input line segments
    - Sample horizontal line segments when they are close to endpoints of estimated vertical vanishing lines
    - Suppose $$z_{est} = (z_x, z_y, z_w)$$ is a representative of estimated zenith VPs
        - Computed as eigenvector with largest eigenvalue of $$\bar{ST}(z)$$
        - Draw a psuedo-horizon by using $$z_{est}$$ and compute intersection points between each sampled line segment and psuedo-horizon
        - Using a line connecting $$z_{est}$$ and image center, separate into two groups:
            - one that intersects the psuedo horizon on left side
            - one that intersects on right side
            - randomly sample both groups in equal amounts to get horizontal candidates
            - see image below

            ![overall]({{ site.blog_url}}/assets/posts/neural-geometric-parser/activation_maps.png)

- Sample candidates of Manhattan directions
    - draw two VPs
        - one from zenith candidates
        - one from either set of horizontal VP candidates

## Designing the neural net

### Input data

- Use all available data
    - raw image
    - VPs
    - lines
- Append information to the raw image as color channels
    - Rasterize line segments as binary map
- Create activation maps by adding the information of vanishing line segments
    - For a given VP v and line equation l, compute closeness between v and l using:

    $$\text{closeness}(l, v) = 1 - \frac{|l . v|}{||l||||v||}$$

    - Activation maps are draw for each caandidate as:

    $$A_{x|y|z}(u,v) = \begin{cases}\text{closeness}(l, v_{x|y|z}) & \text{if line l passes through }(u,v)\\
    0 & \text{else}\end{cases}$$

    - All maps concatenated as additional color channel to get a (224, 224, 17) image

### Architecture

- ResNet backbone

## Training

### Ground truth data

- Assign a GT score by measuring similarities between horizon and zenith of each candidate and those of GT
- Use cossim similarity function from above for zenith
- For horizon, use a new distance metric
    - Compute intersection points between GT and candidate horizons and left/right image boundaries
    - suppose $h_l, h_r$ = intersection points of predicted horizon and left/right border of image
    - compute $g_l, g_r$ using ground truth horizon
    - Similarity between GT and a candidate is:

    $$s_{h_i} = \exp(-\max(||h_{l_i} - g_l||_1, ||h_{r_i} - g_r||_1)^2)$$

### Loss function

- Trained with cross entropy loss:

$$\mathcal{L}_{score} = \sum_i -h_{score}(R_i)\log(c_i)$$

$$c_i = \begin{cases} 0 & \text{if } s_{vh_i} < 0.5\\
1 & \text{else}\end{cases}$$

$$s_{vh_i} = \exp\left(-\frac{(\frac{s_{h_i} + s_{v_i}}{2} - 1)^2}{0.002}\right)$$

## Robustifying score

- results from FSNet can be noisy / unstable
- Incorporating with Manhattan world assumption increased robustness of network
- Given a line segment map and three activation / closeness maps
    - Compute the extent to which a candidate follows the world assumption:

        $$m_i = \frac{\sum_u \sum_v \max(A_x(u,v), A_y(u,v), A_z(u,v))}{\sum_u\sum_v L(u, v)}$$

    $$s_i = s_{vh_i}m_i$$

- the final focal length and zenith is the average of the top-k candidates (k = 8 in the paper):
- $z_{est}$ can be estimated from $$\bar{ST}_{est}$$
- rotation angles can be computed from $$f_{est}, \bar{ST}_{est}$$
- $$\theta$$ is from the highest scoring candidate

# Results

- outperforms all baseline in most eval metrics

![Neural%20Geometric%20Parser%20for%20Single%20Image%20Camera%20Ca%2043559b6975a847a3b4b15b0830114b78/Untitled%202.png]({{site.blog_url}}/assets/posts/neural-geometric-parser/table.png)

![Neural%20Geometric%20Parser%20for%20Single%20Image%20Camera%20Ca%2043559b6975a847a3b4b15b0830114b78/Untitled%203.png]({{site.blog_url}}/assets/posts/neural-geometric-parser/images.png)

- ablation shows that performance decreases strongly without ZSNet
- FSNet learns more from the line map and activation map
    - Shows that lots of geometric cues add more information
- robustification score also helps a lot
