---
layout: post
title: Heart Rate Extraction Using the Android System
---
### Members: Mohammad Saad and Saad Paya

In this project, we developed an Android applicatiom that could detect your heartbeat using nothing but a single camera. This application utilized the Eulerian Video Magnification algorithm in order to do so. The algorithm was defined in a paper by Rubenstein et al. in 2014 [1], as well as Rubenstein's PhD thesis. [2] 

This algorithm models video motion as an Eulerian motion instead of a Lagrangian motion. In other words, instead of the optical flow model that everyone in Computer VIsion uses, we can try and model the changes in pixels with a flow field instead of just a single vector. This allows us to magnify the flow field to see small changes. 

It turns out that a camera, running at a sufficiently high frames per second, can capture miniscule changes in the color of your face. Your face is constantly changing color due to blood rushing through constantly. However, this color is impossible to see normally - it happens so quickly with an incredibly small magnitude of change that it's impossible to detect. 

However, using this algorithm, we can magnify these changes to see the color change in your face.  

