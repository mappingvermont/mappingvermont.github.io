---
layout: post
category : web
tags : [architecture, jekyll, github]
title: Moving to Github Pages
description: "Simplify, simplify, simplify"
---

Happy New Year, all! What a perfect time for the traditional no-new-content-but-yes-there's-a-big-architectural-change blog post!\\
\\
This is no one's favorite genre, but I have to recount (at least for my future self) the way I ran this blog for years. It was nuts.\\
\\
I had no idea how to really run a blog / server / jekyll setup, but I knew I wanted my own machine on AWS so I could understand "devops". So I rented a tiny ubuntu box, and then really went to town. I used jekyll to build my static site, then nginx to serve it. I built [an API](https://github.com/mappingvermont/node-crossfade-api) and even a [user-based web application](https://github.com/mappingvermont/vt-town-tracker).\\
\\
I had no clue how to set any of this up . . . and somehow, likely as a result of my brute force google searches, things worked. Kind of. To update my blog I'd have to build my jekyll site on my machine, then `scp` it to my remote server using my SSH credentials.\\
\\
Given the, ahem, time between posts around here it usually took me about an hour to even find the credentials / reconstruct this build system, and that only increased if I broke something.\\
\\
This is at odds with how I want to blog. I want to be able to put together some ideas in markdown, push them to Github, and then _see_ the results live on the web. Hanging out with [Bill Morris](https://mastodon.social/@bil) the other day I was amazed to see him literally do just that. We figured out [how to use window functions in ogr2ogr SQL statements](https://billmorris.io/shoals/2023/09/27/lower-saxony.html) and I was about to call it a day. Then Bill sent me a link to his brand new blog post covering what we'd discovered 20 minutes earlier.\\
\\
Incredible! Reducing the friction between writing and publishing . . . what a concept! He shared his [guide to deploying a Github Pages site to a custom domain](https://billmorris.io/shoals/2022/01/21/how-to-internet.html) and I took it from there. Very happy to be previewing this locally in jekyll, commiting to GH, and then refreshing my site to watch it go live. Thanks Bill!
