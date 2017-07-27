---
layout: post
title: Convolution - the basics
---

I've been studying convolutional neural networks for a while, and thought it'd be nice to brush
up on the basics, and talk about convolution and how it works.

### What is that?

Well, if you want math...

$$(f * g)(t) = \int_{-\infty}^{\infty} f(\tau)g(t - \tau) d\tau$$

In discrete form, this formula turns into a sum (since integrals are hard with discrete math):

$$(f * g)[n] = \sum_{k = -\infty}^{\infty} f[k]g[n - k]$$

At its heart, convolution reduces down to this one formula. Essentially, what it does is overlap two functions on top of each other, and moves one function (in this case, $$g$$) from $$-\infty$$ to $$\infty$$. Everyone always points to this one Wikipedia GIF to show this happening, and I will too, because it's convenient:

![Convolution GIF](https://upload.wikimedia.org/wikipedia/commons/b/b9/Convolution_of_spiky_function_with_box2.gif)

When the two functions overlap, we multiply the two functions at every point, and then add every single value at that time. (That's what the integral is for!) This allows us to apply operations to any kind of signal that we need. We can convolve our signal with another one to apply any kind of filter we need to any kind of signal, whether that's 1D or 2D.

### Faster Convolution

There's another property of convolution that we need to take into account. Convolution is normally an $$O(n^2)$$ operation, which is terribly inefficient - think two for loops over the entire signal to do that. However, it turns out that a convolution in temporal space is actually a multiplication in Fourier space. So if we Fourier Transform the signal, we can turn our convolution into a point by point multiplication:

$$(f * g)(t) \rightarrow F(\tau)G(\tau)$$

The fastest Fourier Transform algorithms are $$O(n log n)$$, which is still better than $$O(n^2)$$. For a lot of things, it makes more sense to just transform the domain space into Fourier space (or Laplace space, in continuous time), multiply the two signals together, and transform it back to temporal space..

In numpy, this is very easy:

``` python
import numpy as np
def fft_convolution(f, g):
    F = np.fft.fft(f)
    G = np.fft.fft(g)
    return np.fft.ifft(np.multiply(F, G))
```

Next up: 2-Dimensional Convolution!
