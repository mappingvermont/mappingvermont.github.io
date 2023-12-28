---
layout: post
category : general
tags : [history, sports]
title: Hockey Hometowns
description: "Mapping Hockey Player's Birthplaces"
modified: 2016-03-13
---
I'm not much of a hockey fan, but my buddy [Bob Fitch](https://bobsbreakdowns.wordpress.com/) showed me a great API that lists information for every player in the NHL (example: [Boston](http://nhlwc.cdnak.neulion.com/fs1/nhl/league/teamroster/bos/iphone/clubroster.json)). Included in this info is the player's vital stats, twitter handle, and, most importantly, their birthplace. If there's one thing better than an API, it's an API with really cool geographic data.\\
\\
Per always, I put together a [python script](https://github.com/mappingvermont/nhl-birthplaces/blob/master/geocodeBirthplace.py) to geocode these towns using Google's geocoder. I wrote the output to a bunch of [geoJSON files](https://github.com/mappingvermont/nhl-birthplaces/tree/master/outGeoJSON)- both team-specific and all players in the NHL. From here I put this data into in my standard mapping template, and added a filter to allow users to show/hide data by team.\\
\\
Here's the application: [https://www.mappingvermont.org/projects/nhl-birthplaces](/projects/nhl-birthplaces)\\
\\
Unfortunately there are no current NHL players from VT, but we do have the immortal [John LeClair](https://en.wikipedia.org/wiki/John_LeClair) to our credit. Next up, we'll look through [Sean Lahman's baseball database](http://www.seanlahman.com/baseball-archive/statistics/) for evidence of Vermont athletic prowess.
