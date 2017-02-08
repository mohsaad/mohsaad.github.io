---
layout: post
title: Cepstrum Coefficients
---

Cepstrums are an older technique for extracting information about 1-dimensional acoustic signals. It was originally defined in an article by Oppenheim et al [1] as a mathematical tool for nonlinear filtering. It found other uses in acoustics, specifically in speaker and speech recognition.

Cepstrums are useful for extracting the spectral envelope of a signal, which can be used in speech and speaker recognition. We can actually seperate any signal into a spectral envelope and the spectral magnitude, utilizing the Cepstrum features. [2].

The actual equation for calculating cepstral coefficients is 

$$c(t) =  \mathcal{F}^{-1}{\log | \mathcal{F}\left\{x(t)\} |} $$

Where \\(\mathcal{F}\\) denotes the Fourier Transform, \\(c \\) the output cepstrums, and \\(x \\) is the input signal.












# References
[1]:http://www.rle.mit.edu/dspg/documents/nonnlinearfiltering_1968.pdf)
[2]:http://www.speech.cs.cmu.edu/15-492/slides/03_mfcc.pdf