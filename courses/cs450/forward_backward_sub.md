---
layout: page
title: Forward / Backward Substitution
---

Forward and backward substitution is the underlying method that solves all of our linear equations. We can reduce most systems down to a matrix where we can use forward or backwards substitution to solve them.

### Forward Substitution

For a lower triangular system $$Lx = b$$ (where lower triangular implies the matrix has only zeros above the diagonal), we can use forward substitution to solve the matrix. An example of a lower triangular matrix:

$$L = \begin{bmatrix}
1 & 0 & 0\\
2 & 3 & 0\\
4 & 5 & 6
\end{bmatrix}$$

Forward substitution can be expressed as:

$$x_1 = b_1 / l_{11}$$

$$x_i = (b_i - \sum_{j=1}^{i-1} l_{ij}x_j) / l_ii, i = 2,\dots,n$$

In python,

```python
def forward(A, b):
    x = np.zeros(b.shape)
    for j in range(0, A.shape[1]):
        if(A[j][j] == 0):
            break
        x[j] = b[j]/A[j][j]
        for i in range(j+1, A.shape[1]):
            b[i] = b[i] - A[i][j]*x[j]
    return x
```

### Back Substitution

For an upper triangular system we can instead use back substitution, which is essentially the same, with a different way to reduce the second half of the equation. An upper triangular system looks like this:

$$U = \begin{bmatrix}
1 & 2 & 3\\
0 & 4 & 5\\
0 & 0 & 6
\end{bmatrix}$$

Back substitution can be expressed as:

$$x_1 = b_1 / u_{11}$$

$$x_i = (b_i - \sum_{i+1}^{n} u_{ij}x_j) / l_ii, i = n-1,\dots,1$$

In python:

```python
def backward(A, b):
    x = np.zeros(b.shape)
    for j in range(0, A.shape[1]):
        if(A[j][j] == 0):
            break
        x[j] = b[j]/A[j][j]
        for i in range(0, j - 1):
            b[i] = b[i] - A[i][j]*x[j]
    return x
```
