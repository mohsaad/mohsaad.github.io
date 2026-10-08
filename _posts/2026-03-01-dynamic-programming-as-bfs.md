---
layout: essay
title: "Dynamic Programming as BFS on States"
date: 2026-03-01
category: "Engineering"
description: "A different mental model for dynamic programming: breadth-first search over a graph of states."
notion_source: "https://app.notion.com/p/31d7e52c3cce803182dae66faa5e6105"
---

Dynamic programming has always been a really complex topic for software engineers to understand. The idea of memoization, of pre-computing problems and re-using the outputs, is stupidly complex for Leetcode-style interviews, and it’s no wonder most companies have been moving away from these kinds of problems.
When doing my last rounds of interviews, I sort of realized there’s a trick in doing these. There’s two kinds of ways of doing dynamic programming — top down recursion with memoization, and bottom-up looping with an array/hashmap. In this article, I’m going to argue there’s a third way of doing dynamic programming that gets the same result — by doing breadth-first search on the state space.
To show this, we’ll consider the problem *Valid Palindrome III* on [Leetcode](https://leetcode.com/problems/valid-palindrome-iii/description/):
```markdown
Given a string `s` and an integer `k`,
return `true` if `s` is a **k-palindrome**.

A string is **k-palindrome** if it can be transformed
into a palindrome by removing at most `k` characters from it.
```
## Brute Force
The brute force approach is to consider every possible state. We have two pointers, one at the leftmost character and one at the rightmost character. For every character we delete, we start the algorithm over at the next one, until we have k deletions. If we detect a palindrome at any stage, we return true.
An example implementaiton might look like this:
```python
def valid(s: str, k: int) -> bool:
	def check(t: str, l: int, r: int, count: int):
		if count < 0:
			return False
		if l >= r:
			return True
		if t[l] == t[r]:
			return check(s, l + 1, r - 1, count)

		# otherwise, delete either the left or right character
		return check(s, l, r - 1, count - 1) or check(s, l + 1, r, count - 1)

	left = 0
	right = len(s) - 1
	return check(s, left, right, k)
```
This is, as you may imagine, a really terrible solution. Worse case, we will have $`O(2^n)`$ iterations as we need to basically do an iteration every single check and explore every single state space.
So how can we do better? We can memoize a bit by using a hash table.
## Top-Down Recursion
We cache the calls to our DFS function — this allows us to essentially prune states that we’ve already computed:
```python
from functools import lru_cache

def isValidPalindrome(s: str, k: int) -> bool:
    @lru_cache(None)
    def dfs(i: int, j: int) -> int:
        if i >= j:
            return 0

        if s[i] == s[j]:
            return dfs(i + 1, j - 1)

        return 1 + min(dfs(i + 1, j), dfs(i, j - 1))

    return dfs(0, len(s) - 1) <= k
```
This reduces the problem to at most $`O(n^2)`$ states explored, as we immediately prune states that we’ve already explored.
But this is also super confused to explain to someone. If you pass it in, you’re essentially caching all states.
## BFS on state space
Let’s reframe the problem a bit. Let’s define a state as $`(i, j, c)`$ where i is left pointer, j is right pointer, and c is the current number of deletions left. We make a state transition when either
```python
# Case 1: Indices match
s[i] = s[j] # (i, j, c) --> (i + 1, j - 1, c)

# Case 2, indices don't match
s[i] != s[j]
# (i, j, c) --> (i + 1, j, c - 1)
# (i, j, c) --> (i, j - 1, c - 1)

```
We then try to visit every state until i ≥ j OR c &lt; 0. If we’re able to hit the end state (i ≥ j) with c ≥ 0, then we have a successful result. Otherwise, we fail.
This sounds very much like a BFS! We can code it up:
```python
def bfs(s: str, k: int):
	d = deque([(0, len(s) - 1, k)]

	while d:
	  i, j, c = d[0]
	  d.popleft()

	  if c < 0:
	    continue

	  if i >= j and c >= 0:
		  return True

		if i >= j:
		  continue

		if s[i] == s[k]:
			d.append((i + 1, j - 1, c))
			continue

	  d.append((i + 1, j, c - 1))
	  d.append((i, j - 1, c - 1))

	 return False

```
That allows us to make things a lot easier to understand at a high level, without any new data structures — just a 2D array.
