---
layout: page
title: Two ways to do the random streaming problem
hidden: true
---

An interview problem I had went something like this:

> Given some data that is streaming in, return a random data point. You can only
go through the data at most once, and have to use O(1) (i.e. no additional) space.

So there are a two main ways to do this problem, and they both involve taking
advantage of probabilities. To do this, let's first think about the probabilities
of picking a number as it comes in.

If you only have one number, the probability of picking that number is 100%.
If you have two numbers, the probability of picking a number is 50%. If you have
three numbers, you have a 33% chance of picking one of them. And so on.

At the beginning before we've even looped through the problem, we know a few things:

1. There is at least one value in our stream.
2. If we want a random number, we know it will follow that property defined above,
where the second number will have a 50% chance, the third a 33% chance of being picked,
and so on.

We can approach this problem inductively as a result. We model our stream as
a linked list. Our base case is when length(stream)
= 0, at which point we return the first value in the list:

``` python
class stream:

    def __init__(self, value, next_stream):
        self.value = value
        self.next_stream = next_stream

    def getValue(self):
        return self.value

    def getNext(self):
        return self.next_stream

def getRandomProbability(stream):
    if(stream.next_stream == None):
        return stream.value
    # Implement!

def getRandomEquivalence(stream):
    if(stream.next_stream == None):
        return stream.value
    # Implement!
```

Now we come to the case where we have at least 2 elements or more in the stream.
We need to make a decision on which element to pick as a result. Here, we can generate
a random number to do that for us. But how do we decide between the first element and
the second element in the stream?

## Probability approach

Here, we have two ways. The first method (and the one the interviewer expected) is to
count the number of elements ($$N$$) we've iterated through, generate a random number between
0 and 1, and compare that randomly generated number to the probability of picking a
random number at this point in the stream ($$\frac{1}{N}$$). If the randomly generated number
is less than said probability, then we update the returned value to this one and continue down
the list.

In Python code, this would look like this:

``` python
def getRandomProbability(self):
    if(self.next_stream == None):
        return self.value

    # use a counter to track the number of elements in the list
    counter = 1

    # store the current to be returned element in a variable
    value_to_return = None

    # loop through stream
    while(stream != None):
        # generate a random number
        randnum = random.random()

        # compare to probability
        if(randnum < 1.0 / counter):
            value_to_return = stream.value

        # increment counter and LL pointer
        counter += 1
        stream = stream.next

    return value_to_return
```

This will give us a uniform distribution of values, assuming we run it several times.

## Equivalence approach

However, there is another way to write this code, that does effectively the same thing. Here,
we do the exact same thing up until we generate a random number. Here, we instead generate a
random number $$0 \leq \text{randnum} \leq N$$ and then compare it to the number of elements we
have so far. If they are equivalent, then we update our value to return. The rest of the algorithm
proceeds as normal.

``` python
def getRandomEquivalence(self):
    if(self.next_stream == None):
        return self.value

    # use a counter to track the number of elements in the list
    counter = 1

    # store the current to be returned element in a variable
    value_to_return = None

    # loop through stream
    while(stream != None):
        # generate a random number
        randnum = ceil(random.random() * counter)

        # compare to counter
        if(randnum == counter):
            value_to_return = stream.value

        # increment counter and LL pointer
        counter += 1
        stream = stream.next

    return value_to_return
```

To test whether both of these actually return a uniform distribution, I generated 100 values
in an array, and then generated from 1000 - 100000 random numbers and plotted a histogram of the
results. Ideally, a uniform distribution has all the same values for each bin in the histogram.
While it's not exact, both algorithms get pretty close:

### 1000 random numbers
![Imgur](http://i.imgur.com/NOsnRGQ.png)

![Imgur](http://i.imgur.com/6Rc0kII.png)

### 100000 random numbers

![Imgur](http://i.imgur.com/T1hzGd5.png)

![Imgur](http://i.imgur.com/gzh49ks.png)

## How are these equivalent?

If we assume that random.random() has a uniform distribution, then we know that the
probability of obtaining a random number less than $$\frac{1}{N}$$ is $$ E[X \leq \frac{1}{N}] =
\int_0^{\frac{1}{N}} 1 = \frac{1}{N}$$. That is the expected value in the first method. In the second
method, the probability of getting the last element in a discrete uniform distribution is also $$\frac{1}{N}$$. Since
the probabilities are the same, these methods are equally valid for picking a random number out of a stream of data.

## References

[1] http://www.geeksforgeeks.org/select-a-random-number-from-stream-with-o1-space/
