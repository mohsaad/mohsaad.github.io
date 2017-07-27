---
layout: post
title: Setting up ROS on Ubuntu 16.04 with OpenCV 2.4.13
---

Recently I had to set up ROS to work with OpenCV 2.4.13. Normally, this isn't a huge problem, especially
if you use Ubuntu 14.04, where you can install OpenCV from the package manager. However, if you want to do
any sort of configuring, like using a GPU or build the shared libraries, you're going to have to do some hacking around.
In addition, Ubuntu 16.04 uses ROS Kinetic, which has its own package (compiled without GPU support) for OpenCV3, making
this tutorial necessary if you have any legacy code from OpenCV 2.4 that doesn't run in 3.

Before you do anything, first, uninstall any binary versions of OpenCV from `apt`:

`sudo apt-get remove libopencv-dev ros-kinetic-opencv`

1. Clone the OpenCV repository, and check out 2.4.13:

~~~~~~~~~
mkdir ~/packages && cd ~/packages
git clone https://github.com/opencv/opencv.git
git checkout 2.4.13
~~~~~~~~~

{:start="2"}
2. Build it with your options (for example, I usually build with CUDA) and install:

~~~~~~~~~
cd opencv
mkdir -p build
cd build
cmake -DWITH_CUDA=ON ..
make -j4
sudo make install
~~~~~~~~~

{:start="3"}
3. Now, assuming you have ROS, we need to build `cv_bridge`, which connects OpenCV to ROS. I usually put all my workspaces
into a dependency workspace, so we'll do that here:

~~~~~~~~~
mkdir -p ~/dependency_ws/src
cd ~/dependency_ws/src
catkin_init_workspace
git clone https://github.com/ros-perception/image_common.git && git clone https://github.com/ros-perception/vision_opencv.git
cd ..
catkin_make
~~~~~~~~~


What this does is first initialize a new ROS workspace and appends it to our current ROS path, so that we can launch any
package from anywhere. We then clone two common repositories, `image_common` and `vision_opencv`, which acts as our bridge
between ROS and OpenCV structures. We then compile and make.

Now, if you want to use OpenCV in a ROS project, you need to put dependencies for `cv_bridge` and `OpenCV` in your
CMakeLists.txt:

~~~~~~~~~
find_package(catkin REQUIRED COMPONENTS
    roscpp
    ...
    cv_bridge)

find_package(OpenCV2 REQUIRED)
~~~~~~~~~


Now, compile your project, and it should work! We put the 2 when looking for OpenCV because ROS Kinetic searches for
OpenCV3 first, then OpenCV2, so if you have OpenCV3 also compiled somewhere it shouldn't interfere.
