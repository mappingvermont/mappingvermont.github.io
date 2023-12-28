---
layout: post
category : general
tags : [Sanborn, Montpelier]
title: Exploring Montpelier in 1915
description: "Bringing Sanborn maps into the Digital Age"
modified: 2014-11-23
---
I remember the day I first learned about Sanborn maps. I was in college, taking Historical Geography, and my professor was talking about potential sources for our independent projects. I'm not sure where they fell in the long list of options-- census data, birds eye views, various gazeteers, but I was spellbound when she began to describe Sanborn maps. "The Sanborn maps", she said, "are a collection of incredibly detailed maps of every downtown in Vermont-- each building drawn to scale and labeled. Towns were surveyed roughly every ten years, beginning in the 1880s, and continuing into the 1940s." What a resource! What an incredible record of industry and culture and morphology for the downtowns that we've inherited today!\\
\\
Needless to say, I incorporated Sanborn data into my independent project for my Historical Geography course, and continue to find ways to bring this information into personal and professional work. The one drawback to working with Sanborn maps is their limited availability. Maps made after 1922 are currently protected under copyright law, and many maps before that date have never been scanned.\\
\\
Unfortunately for someone interested in web mapping, neither of these resources (proprietary PDFs or free paper maps) are of much use. Enter the [Library of Congress](http://www.loc.gov/rr/geogmap/sanborn/states.php?stateID=52), which has scanned a few of the many Sanborn maps in its collection. Why they chose Lyndonville, Manchester, Middlebury, Montpelier, and Morrisville I don't know, but I'm very thankful that they did, ultimately selecting Montpelier to try and bring to the web. [UVM Special Collections](http://cdi.uvm.edu/collections/getCollection.xql?pid=btvfi) has scanned Burlington's Sanborn maps, but the thought of mapping an actual city was a little intimidating when I was just beginning the project.\\
\\
I began by downloading all of Montpelier maps for 1915, the most recent year available. I used Adobe Illustrator to stitch the images together, then georeferenced the output in ArcGIS. The resulting tiff had different x and y dimensions, so I resampled it, selecting the smallest resolution available (1 cm) in hopes of keeping the map annotation legible. While this wasn't the most difficult part of the process, it was probably the most CPU intensive-- it took my machine a total of 250 hours to resample the raster. I then used TileMill to process the raster into a tile package, and am serving them using this [PHP script](http://carte-libre.fr/map/mbtiles-server-php-demo/mbtiles-server.php.txt).\\
\\
There you have it. After many challenges-- technological, historical, artistic, the web map is finally up. I've added some historical photographs too-- I think it makes the map a little more interactive. Please get in touch with questions/comments, especially if you're interested in collaborating on this work for another town in Vermont! Here's the final product:\\
\\
[Mapping Historic Montpelier](/projects/sanborn/montpelier)
