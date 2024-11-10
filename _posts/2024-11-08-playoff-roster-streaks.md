---
layout: post
category : sports
tags : [basketball, postgres]
title: Playoff Roster Streaks by University
description: "What college holds the record for consecutive years with an alumnus in the (W)NBA Finals?"
---

I was watching the NBA Finals last summer and thinking about Duke. So many great players went there - Grant Hill, Jayson Tatum, Kyrie Irving, Shane Battier, etc. Given how many great players they've had, how often has one of their players played in the NBA Finals? It got me thinking - what school holds the record for most consecutive (W)NBA Finals where they're represented by one of their graduates?\\
\\
I'm a big fan of sports trivia, and I don't think I've ever heard this one. Let's dive into the data and find out.

## The data

Wikipedia generally has this data available in a standard table in the article about [each Finals series](https://en.wikipedia.org/wiki/2024_WNBA_Finals). I was prepared to write all kinds of hacky beautifulsoup code to pull this down, but now pandas has an amazing HTML table parser- all I had to do was find the index of the right table in the page ✨\\
\\
Here's a sample of the data from the first WNBA Championship in 1997. Full data (and code) for this project is in this [github repo](https://github.com/mappingvermont/playoff-roster-streaks).

| Name | College | Year |
| :-- | :-- | :-- |
| Guyton,  Wanda | South Florida | 1997 |
| Harris,  Fran | Texas | 1997 |
| Jackson,  Tammy | Florida | 1997 |
| Moore,  Yolanda | Mississippi | 1997 |
| Perrot,  Kim | Southwestern Louisiana | 1997 |
| Swoopes,  Sheryl | Texas Tech | 1997 |
| Thompson,  Tina | USC | 1997 |
| Woosley,  Tiffany | Tennessee | 1997 |

## Doing the math

I can't remember the last time that the data part of a project was straightforward! I was really excited to come up with an elegant approach for the analysis. Maybe I'd use python, make some classes, attach names and years to these University objects, then sort them all into a giant list 🤔\\
\\
I did a little googling, and discovered that this is sometimes referred to as a gaps and islands problem. The goal is to identify the islands of data amid the gaps. I was surprised to hear the problem had a name, and even more surprised to see an example solution using postgres.\\
\\
I imported the data and adapted the sample query to my dataset. In only 12 short lines, postgres solved my problem:

```sql
select league, college, min(year) start_year, max(year) end_year, count(*) as frequency
from (
  select distinct_league_college_year.*,
    row_number() over (partition BY league, college order BY year) as seqnum
  from (
    select distinct league, college, year
    from playoff_roster
  ) distinct_league_college_year
) add_seqnum
group by league, college, year - seqnum
order by 5 desc
limit 10;
```

Absolutely mindblowing! Not only is there a name for this weird problem, but postgres can solve it easily. [It's awesome baby](https://www.youtube.com/watch?app=desktop&v=XFULmsIGjVU)!

## And the winner is . . . 🥁

I ran the NBA stats first, and the top five are pretty interesting:

|    College     | Start Year | End Year | Streak    |
| :-- | :-- | :-- | :-- |
| Texas          |       2011 |     2021 |        11 |
| Arizona        |       2015 |     2024 |        10 |
| Minnesota      |       1981 |     1989 |         9 |
| Duke           |       2012 |     2020 |         9 |
| UCLA           |       1982 |     1990 |         9 |

Texas is the winner on the men's side, with 6 of the 11 year's being represented by KD and / or Tristan Thompson. 11 straight years is a pretty good run! Let's look at the women's side:

|    College     | Start Year | End Year | Streak    |
| :-- | :-- | :-- | :-- |
| Connecticut    |       2004 |     2024 |        21 |
| USC            |       1997 |     2003 |         7 |
| Florida        |       1997 |     2003 |         7 |
| Tennessee      |       2016 |     2021 |         6 |
| Duke           |       2015 |     2019 |         5 |

W-O-W. I mean, we knew UConn could take it - but 21 years straight? Unbelivable 🤩\\
\\
UConn also had players go to the finals in 1997, 1999 and 2000. Not too bad. And the list of UConn alums in the WNBA finals? Sue Bird, Maya Moore, DT and Breanna Stewart to name a few.

## Lessons learned

Thanks for playing! Until next time - remember you can count on wikipedia for good data, and postgres to make analysis quick and easy 🎉
