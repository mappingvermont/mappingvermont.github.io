---
layout: post
category : web
tags : [leaflet, roads, topojson]
title: Hills, Brooks, Ponds and Farms
description: "Counting Road Name Frequency by Town"
---

I love Vermont road names. They're often so direct-- there's usually a lime kiln on Lime Kiln Road, and the Goshen-Ripton Road will take you (depending on direction) to Goshen or Ripton. The usual statistic for road name analysis (if there is such a thing) is the most common road name in a state, i.e. "75% of towns in Vermont have a Main St". That's an interesting stat, but I wanted to take it a step further.\\
\\
Instead of tallying statewide totals, I wanted to see what the most common road name word was in each town. I queried the E911 roads database to get a list of roads for each town, then split them up into their component words. States Prison Hollow Rd would become three words-- 'States', 'Prison' and 'Hollow'. I then counted the occurrence of each word by town.\\
\\
It's always interesting to use GIS data in an unconventional way. Instead of actually mapping the road segments, I'm just using the DBF table as a database. The only geographically relevant information is that each road is associated with a town. It requires a little bit of grouping by road name and town to get individual combinations given the multiple segments each road has in GIS, but it's much easier than asking VTrans for an official list. The code is here on GitHub-- lots of python and sqlite: [https://github.com/mappingvermont/vt-road-names](https://github.com/mappingvermont/vt-road-names)\\
\\
After tallying these stats by town, I joined them to town boundaries and [mapped it](/projects/vt-road-names).\\
\\
Fun stuff! Such classic Vermont road names-- lots of Hill, Brook, Old, and Hollow. I love that nearly all the towns in the center of the state have Hill as their most common word, with the occasional Brook thrown in for good measure. There aren't as many hills in the Champlain Valley, of course, so the most common word varies -- some Bay, Shore, and Point suggest proximity to the lake.\\
\\
My favorite result is the concentration of 'Farm' roads in South Burlington, Shelburne and Charlotte. Certainly these were all farming communities once, but something tells me that a lot of these names came after the farms had been converted into developments . . . at least if they're anything like [Brand Farm Dr](https://www.google.com/maps/place/Brand+Farm+Dr,+South+Burlington,+VT+05403/@44.4460825,-73.1713522,479m/data=!3m1!1e3!4m5!3m4!1s0x4cca7963ffa94299:0x714d17f30768a899!8m2!3d44.4460682!4d-73.1685519) in South Burlington anyway.
