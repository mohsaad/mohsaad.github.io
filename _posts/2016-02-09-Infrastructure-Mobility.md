---
layout: post
title: Paper Review&#58; Infrastructure Mobility&#58; A What-If Analysis
tags: [paper-review]
---
Some background: this is an older paper review where instead of trying to explain the paper in detail, I would summarize it, list some assumptions, and then list the pros and cons. The original paper can be found [here](http://webhost.engr.illinois.edu/~gowda2/papers/hotnets-XIII-final12.pdf).

In this paper, Gowda et al. describe an experiment they ran involving robotic wireless access points, and discuss the applications and possible use cases of moving wireless networks. Moving wireless networks involve a wireless access point on a rail moving around to service different areas of a location, allowing for better signal without too much interference. After running an experiment both in a micro-mobile and macro-mobile environment,  Both of these experiments showed that a robot could greatly improve Signal to Noise Ratio in a home environment, as well as avoid interference zones that arise from large environments, therefore improving the data rate and allowing for better transmissions.

Assumptions the paper made was that there would be only one robot moving around, and that in a macro environment there would be other robots moving around without any interference. There is definitely interference from other wireless networks in a multi-agent environment. Another assumption is that the robot will only move along predefined paths, as they did in the experiment. In reality, robots should be free to move wherever and if there is some obstacle it will move off the course. Finally, there are several small assumptions like how we can even get internet and power to these robots without creating a mess of tangled cables.

Three pros of the paper is that in a macro environment, it’s easy to be able to avoid interference zones which may affect wireless networks negatively. With a moving robot, it is easy to just detect and move around these zones without much cost in power. In addition, with robotic wireless networks, if there is an outage somewhere, you can send a robot over there to make up for the network. One final pro is that robots are very cheap, and so you can buy multiple robots for very cheap and move them on rails.

There are a few drawbacks to this paper, which include the extreme power required for all of these robots. From an energy standpoint, having multiple robots move around broadcasting wireless signals is a huge drain on energy resources. Second, it is hard to service every single client in a room, and it may not even be possible with current technology rates. Finally, we also have all the added problems of motion - how to navigate around obstacles and manage other aspects of a robot.
