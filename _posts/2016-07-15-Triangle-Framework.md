---
layout: post
title: A Triangular Framework for Encoding Data in Images
---
### Members: Amr Martini and Mohammad Saad

In this project, we developed a method for encoding binary data into isosceles triangle. Yes, that's right. Triangles. Our original idea was to figure out a more creative way to store information in images. Things like QR codes exist, but they can only store a few bytes of data at most. So we tried to look for a system that would be better for data, and we settled on triangles. Triangles can store quite a bit of data, as we can define bits for the length of two sides and the rotation around the center of the triangle itself, giving us around 12 bits of information per trianlge (which is maybe 10x10 pixels at most). With some space-packing algorithms, you could easily fit a million triangles into an image, as well as define further patterns of triangles to represent even more data, While it's not efficient, it's a new, interesting approach.

#### Encoding


#### Decoding


#### References

