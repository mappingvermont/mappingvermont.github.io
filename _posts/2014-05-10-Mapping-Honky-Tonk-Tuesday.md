---
layout: post
title: Mapping Honky Tonk Tuesday
description: "Scraping data from archive.org, researching the original artists, then mapping their birthplace"
modified: 2013-05-10
category: web
tags : [Leaflet, Honky Tonk, GeoJSON]
---

On any Tuesday at the Radio Bean, one can hear the sounds of honky tonk music played into the early morning. The band draws quite a crowd-- some who want to dance to the upbeat rhythm and blues, others who want to stand in the back, one hand in a pocket while the other grips a beer, and bear witness to the mournful moan of that steel guitar. Whatever you're looking for, Honky Tonk has it-- something about that intimate space, good musicians, and high lonesome sounds always seems to set me right.\\
\\
I grew up listening to this music. My dad is a big country fan, and we'd listen to 90's country every chance we got. I hadn't given it much thought since then, but hearing it again really got me wondering-- where does this music come from? I had a vague sense that it was Southern, some combination of early rock, New Orleans piano, and traditional Appalachian music.\\
\\
After discovering the [Honky Tonk Tuesday archive](http://www.honkytonktuesday.com/), I used python to scrape the setlist from each recording, then used SQL to count each time a particular song had been played. I then found the original artist for each song, and recorded their birthplace. Finally (and this gets to the mapping part) I totaled the number of times the Honky Tonk Tuesday band had played each artist, and drew a corresponding point on a map. More on the python scraping and geocoding in later posts, the map is here:\\
\\
[http://mappingvermont.org/projects/htt/](/projects/htt/)
