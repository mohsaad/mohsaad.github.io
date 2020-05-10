---
layout: post
title: Geometric Art
tags: [projects]
---

Digging through some old Github repositories, I found an old project I had worked on in high school, where I generated some pretty shapes.

![Example Art](http://demonstrations.wolfram.com/GeometricArt/HTMLImages/index.en/popup_3.jpg)

I did this by generating a $$n$$ points on the unit circle with $$(\cos(n\phi), \sin(n\phi))$$ where $$\phi$$ is also a tunable parameter determining the "vertex configuration" (really how far the arc between points is). After generating the points, we can either generate a polygon, line, or Bezier curve connecting each of the points, giving us a neat artistic figure.

The demonstration can be found below (note: the [Wolfram CDF player is necessary to view](http://demonstrations.wolfram.com/download-cdf-player.html)):

<script type='text/javascript' src='http://demonstrations.wolfram.com/javascript/embed.js' >\n</script><script type='text/javascript' src='http://mohsaad.com/assets/js/geometric_art.js'>\n</script><div id='DEMO_GeometricArt'><a class='demonstrationHyperlink' href='http://demonstrations.wolfram.com/GeometricArt/' target='_blank'>Geometric Art</a> from the <a class='demonstrationHyperlink' href='http://demonstrations.wolfram.com/' target='_blank'>Wolfram Demonstrations Project</a> by Mohammad Saad</div><br />
Citation:

Mohammad Saad and Emile Okada  
"Geometric Art"  
 http://demonstrations.wolfram.com/GeometricArt/  
Wolfram Demonstrations Project  
 Published: August 27, 2012
