---
layout: post
title: Chapter 2 Probabilistic Robotics Problems
---

1) so $p(S = faulty) = 0.01$

from the problem, $p(X) = U(1.5)$$

also, $p(X < 1 | S = faulty) = 1$. from bayes rule, $p(X < 1 | S = faulty) = \frac{p(S = faulty | X < 1) p(X < 1)}{p(S = faulty)}$

to find the posterior probability of a sensor fault for N = 1,...10: $p(S = faulty | X < 1)$:

$$p(S = faulty | X < 1) = \frac{p(X < 1 | S = faulty) p(S = faulty)}{p(X < 1)} = \frac{1 * 0.01}{(\frac{1}{3})^N}$$

2)
a)
$$p(d4 = R, d3 = C, d2 = C | d1 = S)$$

because of markov assumption (this is a markov chain), the state only depends on the state before it.

$$p(d4 = R, d3 = C, d2 = C | d1 = S) = p(d4 = R | d3 = C) p(d3 = C | d2 = C) p(d2 = C | d1 = S) = 0.2 * 0.4 * 0.2 = 0.016$$

b) see simulator.py

```python

#!/usr/bin/env python

import argparse
import random

states = ['S', 'C', 'R']

class WeatherSim:
    def __init__(self, initial_state):
        self.state = initial_state

    def get_state(self):
        return self.state

    def _transition_S(self, prob):
        if prob < 0.8:
            self.state = 'S'
        else:
            self.state = 'C'

    def _transition_C(self, prob):
        if prob < 0.4:
            self.state = 'S'
        elif prob > 0.8:
            self.state = 'R'
        else:
            self.state = 'C'

    def _transition_R(self, prob):
        if prob < 0.2:
            self.state = 'S'
        elif prob > 0.8:
            self.state = 'R'
        else:
            self.state = 'C'

    def transition(self):
        prob = random.random()
        if self.state == 'S':
            self._transition_S(prob)
        elif self.state == 'C':
            self._transition_C(prob)
        elif self.state == 'R':
            self._transition_R(prob)
        else:
            return 'U'

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('num', type = int, help = 'Number of states to generate')
    parser.add_argument('state',type=str,help="initial state")
    args = parser.parse_args()
    weather = WeatherSim(args.state)
    print(weather.get_state()),

    state_prob = {}
    for i in range(0, len(states)):
        state_prob[states[i]] = 0

    for i in range(0, args.num):
        weather.transition()
        state_prob[weather.get_state()] += 1

    # calculate probs
    for key in state_prob:
        print("Stationary probability for {}: {}".format(key, state_prob[key] * 1.0 / args.num))

if __name__ == '__main__':
    main()
```

c) $$p(d = S) = 0.643$$
$$p(d = C) = 0.285$$
$$p(d = R) = 0.071$$

d) we can marginalize out each probability:

$$ p(S) = p(S|S)p(S) + p(S|C)p(C) + p(S|R)p(R) = 0.8p(S) + 0.4p(C) + 0.2p(R)$$
$$ p(C) = p(C|S)p(S) + p(C|R)p(R) + p(C|C)p(C) = 0.2p(S) + 0.4p(C) + 0.2p(R)$$
$$ p(R) = p(R|S)p(S) + p(R|C)p(C) + p(R|R)p(R) = 0.2p(C) + 0.2p(R)$$

after solving:
$$
p(C) = \frac{2}{7}
p(R) = \frac{1}{14}
p(S) = \frac{11}{14}
$$

e) entropy = $$-log_2(\frac{2}{7}) - log_2(\frac{1}{14}) - log_2(\frac{11}{14})$$ = 5.96

f) bayes rule to everything:
$$
p(d1 = S | d2 = S) = 0.8
p(d1 = S | d2 = C) = p(C|S)p(S)/p(C) = 2/10 * 11/14 / (2/7) = 11/20
p(d1 = S | d2 = R) = 0
p(d1 = C | d2 = S) = p(S|C)p(C)/p(S) = 4/10 * 2/7 / (11/14) = 8/55
p(d1 = C | d2 = C) = 0.4
p(d1 = C | d2 = R) = p(R|C)p(C)/p(R) = 2/10 * 2/7 / (1/14) = 2/5
p(d1 = R | d2 = S) = p(S|R)p(R)/p(S) = 2/10 * 1/14 / (11/14) = 1/55
p(d1 = R | d2 = C) = p(C|R)p(R)/p(C) = 6/10 * 1/14 / (2/7) = 3/20
p(d1 = R | d2 = R) = 0.2

g) probably, as each state is no longer independent.

3) a) since our sensor is 100% when it rains, we can ignore the other states. using bayes filter (with p(x4) = 1):

p(d5 = S) = p(z|d5 = s) * 1 = 0.6

b)
