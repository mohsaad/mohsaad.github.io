---
layout: post
title: Pattern Recognition HW \# 1
---

I'm doing the homework from [ECE544NA: Pattern Recognition](https://courses.engr.illinois.edu/ece544na/fa2016/). Here's homework 1.

# Homework 1: Pencil & Paper

Suppose that you have a one-layer neural network, of the
	  form $y_i=g(w'x_i+b)$, where $g()$ is some nonlinearity, $b$ is a
	  trainable scalar bias parameter, and $w'x_i$ means the dot
	  product between the trainable weight vector, $w$, and the $i^{th}$
	  training vector, $x_i$.  Suppose you have a training corpus of
	  the form $D=\{(x_1,t_1),...,(x_n,t_n)\}$.

1. Find the derivatives $\frac{dE}{dw_j}$ and $\frac{dE}{db}$, where
	    $E=\sum_i((t_i-y_i)^2)$.  Your answer should include the
	    derivative of the nonlinearity, $g'(w'x_i+b)$.

Substituting the output $y_i$ for $g(w'x + b)$, we have
$E = \sum_i (t_i - g(w'x + b))^2$. Taking the derivative $\frac{dE}{dw_j}$, we see that

$\frac{dE}{dw_j} = 2\sum_i (t_i - g(w'x_i + b))(-g'(w'x_i + b))x_i$


2. Suppose $g(a)=a$.  Write $\frac{dE}{dw_j}$ without $g'()$.

$\frac{dE}{dw_j} = 2\sum_i (t_i - (w'x_i + b))x_i$

3. Suppose $g(a)=\frac{1}{(1+exp(-a))}$.  In this case, $g'(w'x_i+b)$
	    can be written as a simple function of $y_i$.  Write it that
	    way.

4. Use the perceptron error instead: $E=\sum_i(max(0,-(w'x_i+b)\cdot t_i))$.

5. se the SVM error instead: $E=||w||_2^2+C\cdot\sum_i(h(x_i,t_i))$,
	    where $h(x_i,t_i)=\max(0,1-t_i(w'x_i+b))$ is the hinge loss,
	    $C$ is an arbitrary constant, and you can assume that $t_i$ is
	    either +/-1.
