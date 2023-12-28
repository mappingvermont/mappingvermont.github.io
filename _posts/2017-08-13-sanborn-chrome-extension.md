---
layout: post
category : web
tags : [sanborn, chrome]
title: A Sanborn Map For Every New Tab
description: "Building my own Chrome extension"
---

I've spent an inordinate amount of time stitching Sanborn maps into town-wide tifs,
georeferencing them, and then creating map tiles to view on the web. The results often
vary depending on DPI of the scanned maps, the software I use to stitch,
and the quality of my georeferencing, but it's always fun to
to try and understand the geography of these early settlements.
\\
\\
This process also allows one to pan and zoom over the map, which often leads
to interesting discoveries outside the larger dominant industries-- a
fish market in a small corner store, or the city stable for the fire department's horses.
Here are a few of my favorite examples:
\\
\\
![Swanton Suspenders]({{ site.url }}/images/swanton-suspenders.jpg)
\\
The Swanton Suspender company, 1882
\\
\\
![Kow-Kure]({{ site.url }}/images/kow-kure.jpg)
\\
Kow-Kure, the predecessor to Bag Balm, in Lyndonville in 1900
\\
\\
But how to browse all through all the available maps without taking the time to
stitch and georeference each one? When my [Earth View new tab extension](https://chrome.google.com/webstore/detail/earth-view-from-google-ea/bhloflhklmhfpedakmangadcdofhnnoh?hl=en) broke a few weeks ago, I decided to create one of my own for Vermont Sanborn Maps.
\\
\\
As always, the hard part was getting the data. The Library of Congress has a few different
APIs for serving this data, so I wrote some python to code read the [source page](http://www.loc.gov/rr/geogmap/sanborn/states.php?stateID=52), then check each
city for the years available, then download each sheet.
\\
\\
I uploaded this images to an S3 bucket (s3://vermont-sanborn-maps), where
they would be easily accessible. I found a few tutorials about creating chrome
extensions, and with 50 lines of JavaScript and HTML, I put together a simple
viewer to load a random Sanborn map every time a new tab is opened.
\\
\\
All the code is on GitHub [here](https://github.com/mappingvermont/sanborn-chrome-extension), and the extension from the Chrome Store here:
\\
[https://chrome.google.com/webstore/detail/vermont-sanborn-maps-new/mdigfmpeaidjibmfjhadcnbioejfclji](https://chrome.google.com/webstore/detail/vermont-sanborn-maps-new/mdigfmpeaidjibmfjhadcnbioejfclji).
\\
\\
Let me know if you find anything interesting!
