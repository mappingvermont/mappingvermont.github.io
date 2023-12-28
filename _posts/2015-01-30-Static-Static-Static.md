---
layout: post
category : web
tags : [Leaflet, GeoJSON, PHP]
title: Static static static
description: "Lessons learned from a pricey AWS database"
---
When I first made a tentative foray into web development a few years ago, I did so with the help of [this great book](http://www.amazon.com/Learning-MySQL-JavaScript-HTML5-Step/dp/1491949465) from O'Reilly. It had flying squirrels on the cover, and provided a very gentle introduction to the world of dynamic websites.\\
\\
I wanted to build a tool to map E911 addresses, and did so using the stack outlined in this book: the JavaScript on my site passed a town name to PHP, which then queried a MySQL database, returning all the addresses in the town of interest. I handled this response in JavaScript, converting the returned rows into GeoJSON on the fly, then adding them to the Leaflet map. This was kind of a pain to setup-- I had to create a database on Amazon RDS, connect to it via the command line to insert all 300,000 records, learn a little PHP to talk to it, and then experiment with JavaScript until I had the GeoJSON string just right.\\
\\
I did get it set up, and things were great until Amazon decided to start charging me $20/month for a database that was rarely used. Faced with this issue I started to brainstorm other solutions-- how could I query all the addresses by town, convert to GeoJSON, and then load that into the webmap? My first thought was MongoDB: I could host it on my server, and given that it's designed to handle JSON documents, it seemed like a natural fit. I was all set to proceed when a quick check on my available disk space (all of 2 GB) ruled out this option.\\
\\
I was doing some work with [geojson.io](geojson.io) and noticed that one way to save your features was to write them to a Github Gist. This got me thinking about keeping static .geojson files on my server. I could add all these features to a map-- no need to build the GeoJSON string from scratch each time. And it's not like the addresses change very often, nor do I really need to update them if they do. A database-oriented system certainly has the advantage in this respect, but I wasn't changing the data, and can update it just as easily by replacing the GeoJSON files on the server if need be.\\
\\
I used arcpy to export each town to a separate shapefile, then ogr2ogr to batch process all to GeoJSON. I modifed the JavaScript to build a path to the GeoJSON file using the user-supplied town, and the rest, as they say, is history. The E911 viewer runs a little faster, and is a lot cheaper to host.
