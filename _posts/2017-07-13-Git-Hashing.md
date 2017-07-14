---
layout: post
title: Git Hashing in CMake
---

I was wondering how to keep track of a project's status in the actual programming project. For example, it might be useful to log which version of the project you are currently running for debugging purposes. So I figured out this CMake script to do that.

Since every CMake project inevitably has a CMakeLists.txt file, we're going to work there. A good way to keep track of a project's status is to use it's Git commit hash. This allows us to quickly see the status of the codebase at any time, as we can look up the commit hash wherever we need it.

To get the commit hash, we use the git log command:

``` bash
git log -1 --format=%h
```

Next, we need to execute a process whenever we have a CMake build to actually get this Git hash. To do that, we utilize the `execute_process` subcommand in CMake:

``` CMake
find_package(Git) # clearly necessary here

execute_process(
    COMMAND git log -1 --format=%h
    WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}/
    OUTPUT_VARIABLE GIT_COMMIT_HASH
    OUTPUT_STRIP_TRAILING_WHITESPACE
    )
```

Next, we have to add a definition to use in our variable names:

``` CMake
add_definitions(-DGIT_COMMIT_HASH="${GIT_COMMIT_HASH}")
```

Now, we can access the macro GIT_COMMIT_HASH as a string in our C/C++ code when we need it!
