---
layout: post
category : web
tags : [python, flask, REST]
title: Standing up a Basic REST API using Flask
description: "Building pretty URLs for xfade.audio"
---

My first website for DJing was [twoyoutubevideosandamotherfuckingcrossfader.com](http:\\twoyoutubevideosandamotherfuckingcrossfader.com). It's pretty standard, and for a long time it did what it promised: allowed users to play youtube videos, crossfading one into another for a basic DJ-like feel. When it stopped working recently, [Nico Staple](https://twitter.com/stapletweets) set out to build his own. One weekend later, he'd produced this:\\
\\
[xfade.audio](http://xfade.audio)\\
\\
It's got everything: search for videos, create playlists and fade one track into another, all within a sleek interface. My nascent JavaScript skills aren't ready for primetime just yet, but I did want to contribute in some way. One of my favorite features of mapping sites is the ease of sharing map views. As you pan the map and toggle layers, the URL updates-- storing your coordinates and configuration for the layers you have turned on.\\
\\
We set out to build something similar for Crossfade. Instead of encoding all the parameters in the URL, we wanted a compact hash: something like [xfade.audio/#ELe36rd6](http://xfade.audio/#ELe36rd6) that could be used to lookup a JSON config in a database. I've worked a fair amount with Flask, and used [this great tutorial](https://realpython.com/blog/python/flask-by-example-part-3-text-processing-with-requests-beautifulsoup-nltk/) to get me started. The final workflow looks like this:

- User adds/deletes a video from the queue on [xfade.audio](www.xfade.audio)
- Site sends a `POST` request to `crossfade-api.mappingvermont.org/collection/new` containing the config for current videos displayed
- Flask API receives the request, adds the POSTed JSON to postgres
- API responds with the hash-encoded unique ID from the database table

Later, when someone shares the link, a GET request to [crossfade-api.mappingvermont.org/collection/ELe36rd6](http://crossfade-api.mappingvermont.org/collection/ELe36rd6) can retrieve the previous configuration.\\
\\
Check out the [final product](http://xfade.audio). Nico and I were pleasantly surprised by the speed of the response. When this app goes viral, of course, we'll have to rebuild the code, maybe even bringing front-end and back-end code under the same roof. Until then, it was cool to hack on an API that contributes to a beautiful website. Final code is here:\\
\\
[http://github.com/mappingvermont/crossfade-api](http://github.com/mappingvermont/crossfade-api).
