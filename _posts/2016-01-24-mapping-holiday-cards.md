---
layout: post
category: general
tags : [Leaflet, Data]
title: Mapping Holiday Cards
description: "Turning a holiday card list into migration data"
---
I've been sending holiday cards since college, and have been keeping formal track of my list since 2013. This year I decided to geocode my [card list](https://docs.google.com/spreadsheets/d/1QwGgfbiVvu3of4cnOq5Nkrq9L-ScUKVrupSGNBAWRcc/edit?usp=sheets_home) to analyze where I've been sending my cards and where people have moved.\\
\\
I started with a [CSV of all addresses](https://github.com/mappingvermont/holidayCards/blob/master/inputAddresses.csv), then geocoded it using a [python script](https://github.com/mappingvermont/holidayCards/blob/master/buildJSON.py). I initially wrote the output to geoJSON, but ended up creating [custom JSON](https://github.com/mappingvermont/holidayCards/blob/master/addresses.json) to better describe the relationships at play-- humans that receive one card per year at a particular place. From here I brought it into Leaflet, and using the [Leafet Moving Marker plugin](https://github.com/ewoken/Leaflet.MovingMarker), animated people that have changed locations from year to year.\\
\\
The final code is up on [GitHub](https://github.com/mappingvermont/holidayCards). See the link below for the map:\\
\\
[Mapping Holiday Cards](/projects/holiday-cards)
