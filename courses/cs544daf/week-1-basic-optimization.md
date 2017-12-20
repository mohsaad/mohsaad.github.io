---
layout: page
title: Basic Continuous Optimization
permalink: /courses/cs544daf/cs544/week1
---

[Original notes](http://luthuli.cs.illinois.edu/~/daf/courses/Opt-2017/Notes/notes.pdf)

### Classical Problems

* Find $$x$$ such that $$f(x)$$ is minimized
* Some interesting cases
$$
  x \in \mathbb{R} : \begin{cases}
  f \in C^2 & (\text{continuous and 1st, 2nd derivative differentiable})\\
  f \in C' \\
  f \in C^o & (f\text{ convex})\\
  f \in C^o
  \end{cases}
$$

__Constrained__: $$x \in \{ u \mid g(u) = 0 \}$$

__Discrete__: $$x \in \{0,1\}^n$$

__Variational__: We choose a function $$f$$ such that the integral of $$f(u,g(u))$$ with respect to $$u$$ is minimized.

### How do we know we're at a local minimum?

* If any step in any direction makes a cost function get bigger
  * An easy test if $$f \in C'$$ : $$\nabla f = 0$$
  * If $$f \in C^o$$ or worse, life is harder
    * Finding a local test might be difficult
    * Example: $$f(x) = \lvert x \rvert$$
    * Say we have an image with a hole in it, like this depth image

![Depth image](http://nicolas.burrus.name/uploads/Research/kinect_chessboard_manual_depth.png)

We want to fill in the black regions, called $$\Omega$$.

A reasonable criteria would be to minimize the integral over the region of the gradient of the known function with respect to the surface:

$$\min \int_{\Omega} \|\nabla f\| dA$$ subject to $$f = I \text{ on } d\Omega$$

To summarize:

* Don't create derivatives unnecessarily
* Make sure to satisfy any boundary conditions

How should we solve this? We could:

* Discretize, work with the discretized derivative and integral
  * We are now minimizing a function of a (big!) vector

#### Alternative

What properties does $$f$$ have?

* Assume that $$\hat{f}$$ is the solution
* Now, for any test function $$\phi$$ such that $$\phi = 0$$ on $$d\Omega$$, we have

$$ \int_{\Omega} \| \nabla(f + \epsilon)\|^2 dA > \int \|\nabla f\|^2 dA$$ for small enough $$\epsilon > 0$$

(if you make a small move in any direction, the value goes up!) This means that:

$$\frac{d}{d\epsilon} \int_{\Omega} \| \nabla(f + \epsilon)\|^2 dA = 0$$, which doesn't seem helpful, but remember:

$$\nabla (g \cdot v) = (\nabla g) \cdot v + g(\nabla \ v) \Rightarrow$$

$$\int_{\Omega} \nabla \ [\phi \nabla f]dA = \int_{\Omega} \nabla \phi  \nabla f dA + \int{\Omega} \phi(\nabla^2 f)dA \Rightarrow$$

$$ \int_{\Omega} \nabla \ [\phi \nabla f]dA = \int_{d\Omega} (\phi\nabla f)\cdot ds$$

But $$\phi = 0 \text{ on } d\Omega$$:

$$\int_{\Omega} \nabla \phi \cdot \nabla f dA = - \int_{\Omega} \phi(\nabla^2 f)dA$$

This is true for any $$\phi$$, so $$\nabla^2 f = 0$$, which allows us other ways to solve this.
