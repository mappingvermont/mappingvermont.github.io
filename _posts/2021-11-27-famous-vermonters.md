---
layout: post
category : web
tags : [postgres, wikidata]
title: Famous Vermonters
description: "Ranking the people that have called Vermont home"
---

It's been about four years since I've written here, and a lot has changed. My wife and I were married in July 2019, and we welcomed our daughter in April 2021. What a whirlwind! We like to keep the focus on mapping and Vermont here at this site, but I do feel very lucky and proud of our little family ❤️\\
\\
We've also just moved back to the state (July 2021) and I've got a million blog post ideas. I'll start with a straightforward one- who's the most famous Vermonter ever? Ethan Allen? Bernie Sanders? Calvin Coolidge? John Deere? John LeClair?\\
\\
And how do you define famous? And the classic question- how do you decide who is a _Vermonter_? I'm going to rely on wikipedia to enforce both of these standards. It's a little dubious, but we need some help:

- 'Famous' will be defined using [qrank](https://github.com/brawer/wikidata-qrank), a ranking system using wikipedia pageviews
- 'Vermonter' as defined by the [List of people from Vermont](https://en.wikipedia.org/wiki/List_of_people_from_Vermont) wikipedia article


## Pulling the data

I used the incredible npm [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia) package to pull down the Famous Vermonters data. The package made it really easy to pull in this data- letting me poke at it in a node REPL until I had it working correctly. To match each famous vermonter to their respective `qrank`, I then queried the wikipedia API to get their wikidata ID, then wrote the output to a CSV. As a node n00b it probably took me three full hours to get the async stuff right. I tried it all- requests, promises, request-promises, you name it.\\
\\
Here's [the code](https://gist.github.com/mappingvermont/e744eca4308d2bd8b20e032054dc7ea6) to build a CSV of Famous Vermonter and their wikidata IDs in case you want to follow along at home.


## Importing it into SQL

And to import the Famous Vermonters CSV into postgres:

```sql
create table vermonters (qid text, name text);
\COPY vermonters(qid, name) from 'famous_vermonters.csv' DELIMITER ',' CSV HEADER;
```

I did some similar with the qrank dataset, but have misplaced that code. It's a pretty straightforward CSV --> postgres import.


## Database queries

OK, now we've got our famous vermonters CSV and the ranking for all wikidata entries . . . let's join them 🎉

```sql
select distinct on (qrank, qid) name, qrank
from vermonters a,
  qrank b
where a.qid = b.entity
order by qrank desc, qid;
```

## And the winner is . . . 🥁🥁🥁

Now bear in mind that this is purely a ranking of how many times folks have clicked on this person's wikipedia page. And this person didn't even really grow up in Vermont. And . . . ok here are the final rankings:


| name | qrank|
|---|-----|
| Ted Bundy (1946–1989), serial killer; born in Burlington | 12098835|
| Bernie Sanders, politician, Vermont Senator since 2007 |  5997027|
| Calvin Coolidge, 30th President of the United States; born in Plymouth Notch |  2338343|
| Rudyard Kipling, British author; resident of Brattleboro when he wrote The Jungle Book  |  2085495|
| Aleksandr Solzhenitsyn, Russian author, recipient, 1970 Nobel Prize for Literature |  1908792|
| Randy Quaid, actor |  1868975|
| Felicity Huffman, actress; attended school in Putney |  1858119|
| Louise Glück, Pulitzer Prize-winning poet |  1609669|
| Joseph Smith (1805–1844), founder of Latter Day Saint movement; born in Sharon |  1577037|
| Joanna 'JoJo' Levesque, singer, actress; born in Brattleboro   |  1537455|

## What's next?

Wow - by wikipedia standards Ted Bundy is more than twice as famous as Bernie Sanders . . . eesh. I'm not sure how we can change this, other than visiting the wikipedia articles of our favorite lesser-known Vermonters to bump them up the list. I'll make a plug here for [Hetty Green](https://en.wikipedia.org/wiki/Hetty_Green), [Cyrus Pringle](https://en.wikipedia.org/wiki/Cyrus_Pringle) and of course [Phineas Gage](https://en.wikipedia.org/wiki/Phineas_Gage).


