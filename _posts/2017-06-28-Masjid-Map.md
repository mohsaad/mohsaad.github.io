---
layout: post
title: Map of Masjids across America
---

A few weeks ago, my sister was curious about where Muslims live. How can we estimate where Muslims live, pray and work?

One resource we could use is the number of mosques across America. A mosque generally indicates that there is some community of Muslims in that area that work and live there. So we can get a general estimate, at least at the state or county level. Using this as my metric, I needed a resource to figure out where mosques actually are.

![Masjid Darussalam](http://darussalamfoundation.org/wp-content/uploads/DSC_8753-600x400.jpg)

That resource is called [salatomatic.com](https://www.salatomatic.com). An offshoot of [zabihah.com](https://www.zabihah.com), which provides a nice database of Halal eateries, Salatomatic.com finds Mosques near your location. I was able to scrape the location of (almost) every Mosque across America. There are still a couple I'm missing - for example, Salatomatic.com lists 3 mosques in Wyoming, but I don't see any on my map.

![Masjid Map](http://mohsaad.com/imgs/masjid_map.png)
(Copyright Mohammad Saad, 2017. )

If you're curious as to how I did this, I used [this scraper](https://github.com/fayland/scrapers/blob/master/zabihah.com/zabihah.py) thanks to fayland on Github to get each webpage on the site (but clearly not all of them). I then used BeautifulSoup to extract and filter out the mosques on the website, which gave me an address. Afterward, I took each address and geocoded it into a GPS coordinate using the [Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro). Finally, I plotted it on a map

There's a couple interesting things we can do here. We can see where the Muslim population breakdown by county:

![Masjid Map by county](http://mohsaad.com/imgs/masjid_map_counties_low_res.png)

(A higher resolution map can be downloaded from here: [Masjid Map High Res](http://mohsaad.com/imgs/masjid_map_counties.png) 19200 x 14400 pixels, 12.5 MB)

One thing I want to work on in the future is visualizing the density by state and county. I know how to do it, but it requires me to re-geocode all the addresses and get the county name, which will take some time.
