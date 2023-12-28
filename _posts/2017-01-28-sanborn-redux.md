---
layout: post
category : web
tags : [sanborn, mapnik, history]
title: Sanborn Redux
description: "Putting Southeastern VT on the map"
---

The Library of Congress has posted scans of [new Vermont Sanborn maps](http://www.loc.gov/rr/geogmap/sanborn/states.php?stateID=52)! And that, of course, means I am duty-bound to stitch the various maps together, georeference them, and tile the results for the web. I've done this for three towns I know fairly well-- Saxtons River, Bellows Falls, and Springfield.\\
\\
Unlike my previous work with the 1915 Sanborn map of Montpelier, these maps are much older-- made between 1894 and 1896. It makes for an interesting comparison. Where Montpelier has car garages, Bellows Falls has stables and outhouses. The older maps also cover much less area. Each were two sheets, whereas Montpelier was nineteen, and required much stitching and prep in Illustrator.\\
\\
In addition to expanding the geographic coverage of the maps, I've improved the method of tile generation. I've got a better sense now of the proper export resolution for the maps, and am using Mapnik directly to render the tiles. Both combine to make a much better output, most clearly seen in the handwriting at high zoom levels.\\
\\
I've also built a little [Node application](http://www.github.com/mappingvermont/sanborn-vt) to create links to specific towns. The link [https://www.mappingvermont.org/projects/sanborn/saxtons-river](https://www.mappingvermont.org/projects/sanborn/saxtons-river) will redirect users to the zoom level and location appropriate for Saxtons River, using the wonderful [leaflet-hash](https://github.com/mlevans/leaflet-hash) library.\\
\\
Hopefully this will make it easier to share maps, and can also be used to link directly to interesting locations, like this "Chine laundry" in the basement of the old Oona's building in Bellows Falls: [https://www.mappingvermont.org/projects/sanborn/#21/43.13454/-72.44476](/projects/sanborn/#21/43.13454/-72.44476)\\
\\
Like my work with Montpelier, I'm also looking for historic images for these maps. If you know of photos of Bellows Falls, Saxtons River or Springfield from the 1890s, please be in touch!

