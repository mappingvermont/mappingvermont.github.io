---
layout: post
category : sports
tags : [ai, ui]
title: Mapping VPR's Town-by-Town Project
description: "In which I finally produce an aesthetically pleasing web application - with claude"
---

[Vermont Edition](https://www.vermontpublic.org/show/vermont-edition) is touring the state, doing one show a month about a different town until they've done them all. I'm thrilled. What a fantastic geography project. The shows have been great too, full of small town Vermont characters, history and care.\
\
This is the kind of project that demands a map - something like my [DC fire stations work](https://www.mappingvermont.org/projects/dc-fire-stations/) but flashier. Maybe this one could even work on mobile? My front end skills have only atrophied in recent years, but luckily claude is more than capable. Within an hour it had put this together: https://www.mappingvermont.org/projects/town-by-town/.\
\
Pretty good right? Clean, aesthetically pleasing, with a nice scroll bar and map interplay. I'm proud to say I did contribute - I downloaded the canoncial VT town boundaries from VCGI, then told claude to load them into postgis and clip them to Lake Champlain, etc. We debated how much mapshaper simplification to do, and I was also consulted on what properties to include in the JSON episode schema.\
\
Admittedly I didn't do much. There was no "ah-ha" moment, where after reading docs for an hour I finally realized the `.zoomTo()` method I needed. Nope, claude pretty much did it all - I didn't learn a thing. Honestly I think it mostly asked for input just to humor me.\
\
I showed the site to [Mikaela](https://www.vermontpublic.org/people/mikaela-lefrak) and asked if she wanted to put it on the official VPR website. She was very enthusiastic, and most of her coworkers were too. After a week or so the enthusiasm has petered out - they're pursuing a rebrand, they'd need to figure out how to embed it in an iFrame, the branding isn't quite right. Honestly that's fine with me. A few years ago I would be crushed. A site like this would have taken me hours. Now anyone can build it. Shipping is easy.\
\
I definitely feel some angst about losing the problem-solving part of my job. I still work on puzzles, but there aren't as many, and they're more complex. I miss iterating on a schema, or digging into a function to understand what value it returned. That being said, I love my work and shipping things still makes me happy. I want to make our API match the real world. I want to make a map showing VPR's progress through each town in the state. As long as the end product still brings me joy, I think it's still worth it.
