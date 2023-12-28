---
layout: post
category : web
tags : [baseball, databases]
title: All Star Infields
description: "Searching for a team to match the 2016 Cubs"
---

The MLB All Star game is tonight, and the Cubs have accomplished something rare: they have starters at four of the five infield positions. Not only that, but they ring the diamond: \\
\\
1B: Anthony Rizzo\\
2B: Ben Zobrist\\
SS: Addison Russell\\
3B: Kris Bryant\\
\\
What a team! I can't remember any team even coming close to this All Star royal flush. One of my friends claimed that the 1996 Yankees did the same, but only Wade Boggs started for them in the All Star game that year.\\
\\
How many times has this happened? I quickly got into a Wikipedia hole trying to find out-- and eventually started writing code to scrape the statistics for each year so that I could query them. But scraping Wikipedia is hard! The URLs are fairly regular, but their data is in [every](https://en.wikipedia.org/wiki/1933_Major_League_Baseball_All-Star_Game) [tabular](https://en.wikipedia.org/wiki/1944_Major_League_Baseball_All-Star_Game) [format](https://en.wikipedia.org/wiki/1951_Major_League_Baseball_All-Star_Game#Opening_Lineups) [imaginable](https://en.wikipedia.org/wiki/1996_Major_League_Baseball_All-Star_Game#Starting_lineups).\\
\\
After a few hours of this, I remembered [Sean Lahman's baseball database](http://www.seanlahman.com/baseball-archive/statistics/). Thank goodness! Within a few minutes, I was writing SQL queries against perfectly normalized data, loading the results into a nested dictionaries and tabulating the results. For those interested, the GitHub repo is [here](https://github.com/mappingvermont/all-star-infields).\\
\\
And now for the results! Three teams have matched the Cubs with four players elected to infield positions:

### 1957 Cincinnati Redlegs
C: Ed Bailey\\
2B: Johnny Temple\\
SS: Roy McMillan\\
3B: Don Hoak

### 1963 St. Louis Cardinals
1B: Bill White\\
2B: Julian Javier\\
SS: Dick Groat\\
3B: Ken Boyer

### 1976 Cincinnati Reds
C: Johnny Bench\\
2B: Joe Morgan\\
SS: Dave Concepcion\\
3B: Pete Rose\\
\\
Pretty cool! And definitely a good reminder to seek out existing data sources. Scraping data can be fun, but I'm happy to let other people sort out issues with missing data/complicated data. Stay tuned for maps of Vermont-born baseball players from this same dataset!

