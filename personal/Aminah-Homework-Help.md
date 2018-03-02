---
layout: page
title: Homework help
---
### Problem 1

$$P(dinner) = 0.56, P(happy | dinner) = 0.91, P(happy | \neg dinner) = 0.19, P(dinner | happy) = 0.8591$$

First we need to calculate $$P(happy)$$. From Bayes Rule:

$$P(happy | dinner) = \frac{P(dinner | happy)P(happy)}{P(dinner)} \Rightarrow P(happy) = \frac{P(happy | dinner)P(dinner)}{P(dinner | happy)} = 0.593178$$

Now we can calculate $$P(\neg happy) = 1 - P(happy) = 0.406821$$.

We are trying to find $$P(\neg dinner \| \neg happy)$$. Let's expand this out:

$$P(\neg dinner | \neg happy) = \frac{P(\neg dinner, \neg happy)}{\neg happy)}$$

Expanding out the numerator:

$$P(\neg dinner, \neg happy) = P(\neg happy \|\neg dinner)P(\neg dinner)$$.

We actually already have $$P(\neg happy \| \neg dinner)$$, from $$P(happy \| \neg dinner)$$. It turns out that:

$$P(\neg happy \| \neg dinner) = 1 - P(happy \| \neg dinner) = 0.81$$.

So, $$P(\neg dinner, \neg happy) = 0.81 * 0.44 = 0.3564$$, and as a results

$$P(\neg dinner | \neg happy) = \frac{P(\neg dinner, \neg happy)}{P(\neg happy)} = \frac{0.3564}{0.406821} = 0.87606$$
