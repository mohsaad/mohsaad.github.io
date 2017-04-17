---
layout: post
title: Designing a second-order analog filter
---

So normally, I'm not a huge circuit person. In fact, circuits was the part
of Electrical Engineering that I tried to avoid, oddly enough. However, when I
was doing my B.S. thesis, I had to design an analog second-order filter. Here's
how I did it.

### Requirements

The circuit had to be a

* 2nd order analog Butterworth low-pass filter
* Sallen-Key Topology
* 20 kHz ± 5% 3dB bandwidth
* 40 dB/decade rolloff, ±10%

### Sallen-Key Topology

Before we even start, we want to use a certain topology (or design method) for
our circuit. The Sallen-Key topology for a second-order filter is a fairly common one, and it can be seen
below:

![Imgur](http://i.imgur.com/SRVNs9V.png)

The gain in this circuit is controlled by the resistors $$R_3$$ and $$R_4$$. The
gain $$A_0$$ itself is computed as

$$A_0 = 1 + \frac{R_4}{R_3}$$

However, we want a unity gain, or a gain of 1. To do that, we essentially have to make
$$R_3 = \infty$$, which we can do by removing $$R_3$$ altogether. This means we can set
any value for $$R_4$$, so we set $$R_4 = 0$$ for now. The updated diagram can be seen below.

![Imgur](http://i.imgur.com/5a6ALhu.png)

(Now, you may be thinking: $$\frac{0}{\infty}$$ is not a number either! But any wire has some
arbitrarily small resistance to the point where it's not exactly 0, but close enough so the math works
out).

Now, we only have four parameters in our circuit to solve for: $$R_1, R_2, C_1, C_2$$.

### Design Equations

To determine the parameters, we can use Kirchoff's Voltage (KVL) and Kirchoff's Current Law (KCL) to determine the
transfer function of the circuit, which we can then use to solve for our parameters.

First, let's mark all the nodes on our circuit:

![Imgur](http://i.imgur.com/mq9fJq3.png)

Writing out the KCL at $$V_1$$, we see that:

$$\frac{V_{in} - V_1}{R_1} = \frac{V_1 - V_2}{R_2} + \frac{V_1 - V_{out}}{\frac{1}{sC_2}}$$

Writing out the KCL at $$V_2$$, we see that:

$$\frac{V_1 - V_2}{R_2} = \frac{V_2}{\frac{1}{sC_1}}$$

One last thing to note is that $$V_{out}$$ is directly connected to the negative terminal
of the op-amp. We assume an ideal op-amp model for our case, so that means the positive and negative
terminal of the op-amp have the same voltage. This means we also have a third equation for our circuit:

$$V_{out} = V_2$$

### Solving the Design Equations

A transfer function is defined as $$H(s) = \frac{V_{out}(s)}{V_{in}(s)}$$. So first, let's
substitute in $$V_{out}$$ for $$V_2$$:

$$\frac{V_1 - V_{out}}{R_2} = \frac{V_{out}}{\frac{1}{sC_1}}$$

Solving for $$V_1$$, we find that

$$V_1 = V_{out}(1 + sC_1R_2)$$

Now, we can substitute this portion into our first equation to find the transfer function $$H(s)$$:

$$\frac{V_{in} - V_{out}(1 + sC_1R_2)}{R_1} = \frac{V_{out}(sC_1R_2)}{R_2} + \frac{V_{out}(1 + sC_1C_2R_2) - V_{out}}{\frac{1}{sC_2}}$$

$$\frac{V_{in}}{R_1} = V_{out}(\frac{1 + sC_1R_2}{R_1} + sC_1 + s^2C_1C_2R_2)$$

$$V_{in} = V_{out}(1 + sC_1R_2 + sC_1R_1 + s^2C_1C_2R_1R_2)$$

$$H(s) = \frac{V_{out}}{V_{in}} = \frac{1}{1 + sC_1(R_1 + R_2) + s^2C_1C_2R_1R_2}$$

### Design Specifications

According to [1], the Butterworth filter itself has a transfer function of the following equation:

$$H_{butter}(s) = \frac{1}{1+a_1s + b_1s^2}$$

Here, $$a_1 = \sqrt{2}$$ and $$b_1 = 1$$.

Since we also know our filter cutoffs (20 kHz), we can place them in our design equations in
the appropriate place:

$$H(s) = \frac{V_{out}(s)}{V_{in}(s)} = \frac{1}{1 + \omega_cC_1(R_1 + R_2)s + \omega_c^2C_1C_2R_1R_2s^2}$$

Knowing our Butterworth filter form, we can find which parameters equal which:

$$A_0 = 1$$

$$a_1 = \omega_cC_1(R_1 + R_2) = \sqrt{2}$$

$$b_1 = \omega_c^2C_1C_2R_1R_2 = 1$$

Now, we can solve for the appropriate $$R_1$$ and $$R_2$$, given $$C_1$$ and $$C_2$$.

$$R_1R_2 = \frac{b_1}{\omega_c^2C_1C_2}$$

$$(R_1 + R_2) = \frac{a_1}{\omega_c C_1}$$

Solving for $$R_1$$, we see that:

$$R_1 = \frac{a_1}{\omega_c C_1} - R_2$$

Plugging into our first equation:

$$(\frac{a_1}{\omega_c C_1} - R_2)R_2 = \frac{b_1}{\omega_c^2C_1C_2}$$

We can rearrange this equation into a quadratic form:

$$R_2^2 - \frac{a_1R_2}{\omega_c C_1} + \frac{b_1}{\omega_c^2C_1C_2} = \omega_c^2C_1C_2R_2^2 - \omega_c a_1C_2R_2 + b_1 = 0$$

Using the quadratic formula, we can obtain a solution for $$R_2$$:

$$R_2 = \frac{(\omega_c)(a_1C_2) \mp \sqrt{\omega_c^2 a_1^2 C_2^2 - 4\omega_c^2C_1C_2R_2^2b_1}}{2\omega_c^2C_1C_2}$$

Doing a little simplification:

$$R_2 = \frac{a_1C_2 \mp \sqrt{a_1^2C_2^2 - 4C_1C_2b_1}}{2\omega_cC_1C_2}$$

Only one of these roots is a real, positive value. We can repeat the same procedure for $$R_1$$ to find that we
obtain the exact same equation, with the difference being the sign in front of the discriminant. So, our values of
$$R_1, R_2$$ are:

$$R_{1,2} = \frac{a_1C_2 \mp \sqrt{a_1^2C_2^2 - 4C_1C_2b_1}}{2\omega_cC_1C_2}$$

Both of these values depend on the discriminant being positive. So, we analyze the discrimiant:

$$a_1^2C_2^2 - 4C_1C_2b_1 \geq 0$$

Separating out $$C_1$$ and $$C_2$$, we find:

$$a_1^2C_2^2 \geq 4C_1C_2b_1$$

$$C_2 \geq \frac{4b_1C_1}{a_1^2}$$

Since $$a_1 = \sqrt{2}$$ and $$b_1 = 1$$, this equation reduces down to:

$$C_2 \geq \frac{4C_1}{2} \Rightarrow C_2 \geq 2C_1$$

### RC Circuit Parameters

To fulfill the specifications as specified in the first section:

$$C_1 = 400 pF, C_2 = 1000 pF$$

This implies that:

$$R_1 = 7.776 k\Omega, R_2 = 20.359k\Omega$$

### Simulations

So, after deriving the parameters, I simulated the circuit in LTSpice:

![Imgur](http://i.imgur.com/hdurNKq.png)

I simulated it and got a perfect low-pass filter:

![Imgur](http://i.imgur.com/lsSkPsl.png)

We can clearly see the rolloff being less than 10%, and we hit a floor of exactly 40dB.

### The circuit itself

Finally, I took a small board and soldered everything to it. Here's how it looks:

![Imgur](http://i.imgur.com/lMPopKW.jpg)

### References

[1] [Texas Instruments Active Filter Design](https://focus.ti.com/lit/ml/sloa088/sloa088.pdf)
