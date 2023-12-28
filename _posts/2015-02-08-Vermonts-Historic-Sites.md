---
layout: post
category: general
tags : [Leaflet, History]
title: Vermont's Historic Sites
description: "Geolocating historic markers across the state"
---
Whenever I see a historic marker in Vermont, I have to stop and look at it. You never know what might have happened in this very spot two hundred years ago-- a future president born, a revolutionary war battle, or a whole industrial apparatus alive in this now-empty meadow. In addition to formally recognizing such sites with that classic green plaque, the State has also posted a list of their locations (albeit in a hard to read/harder to download iframe table format) on their [website](http://historicsites.vermont.gov/roadside_markers/list).\\
\\
Seeing a list of locations in the state, my first instinct was to map it. Looking at the dataset further, however, I realized that less than half of the entries had an actual latitude and longitude. Most locations were fairly well described- "intersection of Brook Rd and Thaddeus Stevens Rd"- but some just called out nearby landmarks, i.e. "near the village". With the help of auxilary sources such as [wayfaring.com](http://www.waymarking.com/cat/details.aspx?f=1&guid=9cd074cf-33c7-4e49-8c79-0cde5f9c39a6&st=2) and the [Historical Marker Project](http://www.historicalmarkerproject.com), as well as various town and city websites, I set out to georeference the remaining markers.\\
\\
This research is not what I'd prefer to spend my free time on, but any project requires data cleanup, and some more than others. I was able to locate all but three historic markers. They are, in no particular order:
- State Seal Pine Tree, North of Route 313 & West of 7, Arlington
- D.P. Thompson, Montpelier - Barre Rd, Montpelier
- Levi P. Morton, Route 22A, north of village, Shoreham

\\
Mapping the remaining 200+ markers was an interesting exercise. From my time in Burlington, I've definitely noticed a lot of markers there-- celebrating Ethan Allen, various Civil War regiments, and the creation of the pedestrian mecca that is Church St, among other things. Seeing them all on a map (fourteen in total) made me start to think about historical marker distribution. Investigation of other high-density historical marker areas (I'm looking at you Woodstock and Dorset) only led to more questions. Questions like . . . why doesn't Barre have a single historic marker, and Woodstock has five?\\
\\
I suspect it might have a little something to with tourism, and with the motivated local governments that submit such historic prose to the State. Here's one of my favorite examples of a 'historic' marker, this in the village of Belmont, but that could easily apply to any hamlet in the state:
{% highlight css %}
Mechanicsville was a village center in the Town of Mount Holly, which was chartered
in 1792. The village prospered with the growth of water-powered manufacturing, that
included sawmills, gristmills, wheelwrights, furniture shops, and the A.P. Chase
Toy Factory. As manufacturing declined, Mechanicsville became popular with
vacationers. The citizens petitioned to have the village name changed to Belmont to
better fit the image of an idyllic summer retreat. The change was enacted on
September 2nd, 1911.
{% endhighlight%}
\\
See below for a link to the map of the state's historic markers. Feel free to comment if any locations are wrong, or if you discover any errors in the text.\\
\\
[Vermont's Historic Sites](/projects/vermont-historic-sites)
