---
layout: post
title: Calculating where a ray intersects a cylinder
---

I had this problem at work, and thought I'd compile a quick tutorial for a solution to this.

Say we have a cylinder pointing upwards, with the bottom cap at $$p_1 = (p_{1x}, p_{1y}, p_{1z})$$ and the top cap at $$p_2 = (p_{2x}, p_{2y}, p_{2z})$$. First we need to define the infinite cylinder equation in 3 dimensional space, which is defined in terms of a single point, a radius, and a direction vector:

$$x^2 + y^2 - r^2 = 0$$

For an infinite cylinder, z is infinity - we don't need to worry about it since the cylinder defined above is parallel to the z-axis.

For an arbitrary point $$q$$ in our infinite cylinder, we can plug it into our cylinder equation to find the equation for any point on the infinite cylinder:

$$(q_{x} - p_{1x})^2 + (q_{y} - p_{1y})^2 - r^2 = 0$$

$$\Rightarrow (q - p_{1} - (v_a \cdot (q-p_1))v_a)^2 - r^2 = 0$$

$$v_a = \frac{p_2 - p_1}{||p_2 - p_1||}$$

The reason we need that last term is to remove any z-components from our equation when subtracting out the two points, as they are not in the original equation.

Now, we can plug in a specific ray $$(s + v_st)$$ to see where the points of intersection are:

$$(s + v_st) - p_{1} - (v_a \cdot ((s+v_st)-p_1))v_a)^2 - r^2 = 0$$

This reduces to a quadratic with the following terms:

$$a = v_s - (v_s \cdot v_a)v_a)^2$$

$$b = 2((v_s - (v_s \cdot v_a)v_a) \cdot (s - p_1) - ((s - p_1) \cdot v_a)v_a)$$

$$c = ((s-p_1) - ((s-p_1) \cdot v_a)v_a)^2 - r^2$$

$$at^2 + bt + c = 0$$

$$t = \frac{-b \mp \sqrt[]{b^2 - 4ac}}{2a}$$

A non-negative value of $$t$$ will tell us when the ray intersects the cylinder, and we can then calculate the specific point as well by plugging it in. For a finite cylinder, we can actually figure out if it intersects by checking the ray's $$z-$$coordinate at the times given by the quadratic. If $$p_{1z} <= s_z + v_{sz}t_{calc} <= p_{2z}$$, then we have an intersection in the finite cylinder, and we're good!
