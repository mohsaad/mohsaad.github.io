---
layout: post
title: Recursive Directory Iterator
description: A quick tutorial on boost's recursive directory iterator.
category: articles
tags: ['c++', 'programming']
---

Boost's [`recursive_directory_iterator`](https://www.boost.org/doc/libs/1_55_0/libs/filesystem/doc/reference.html#Class-recursive_directory_iterator) is really useful for iterating through files. Give it a path to a directory:

```c++
boost::filesystem::recursive_directory_iterator rdi(".");
```

And you can easily access any file using the powerful `path` library. A quick example - say we want to find any
file with an extension of `.txt`:

```
boost::filesystem::recursive_directory_iterator rdi;
boost::filesystem::recursive_directory_iterator rdi_end;
for (rdi; rdi != rdi_end; ++rdi) {
  if ((*rdi).path().extension() == ".txt") {
    std::cout << ((*rdi).path().string()) << std::endl;
  }
}
```

This is super useful if you just need to upgrade a bunch of files in a specific
directory, which I find myself doing more than I want to.
