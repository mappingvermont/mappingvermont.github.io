---
layout: post
category : sports
tags : [basketball, postgres]
title: WNBA Postmortem
description: "I drafted the perfect WNBA fantasy team - what went wrong?"
---

I joined a WNBA fantasy league this year, and let me tell you - I am terrible. I pancicked during the draft, dropped my best players and mismanged my IR. I'm just glad our league didn't trade much - one less reason for fantasy self-loathing. With two weeks left I was 2-8 on the year, and our commissioner had to inform me that I was mathematically eliminated from the playoffs.\\
\\
The silver lining here is that now that the season is over (for me, anyway) it's time for some postmortem data analysis 🔎\\
\\
The code for this all lives in [this repo](https://github.com/mappingvermont/wnba-postmortem) but we'll stick to the "highlights" here. Also shoutout to the lovely [espn-api](https://github.com/cwendt94/espn-api/) package which made pulling this data (relatively) painless 🎉.

## What happened during the draft?

ESPN has a pretty good draft UI. It shows projected points, points in the last year, etc. I selected Arike Ogunbowale with my first pick in the draft. I've been blaming most of my struggles on her lack of output, but when comparing her drafted position to her total point rank, it's not that bad - I drafted her #5 and she's #29 overall. Not exactly what you'd want from your #5, but not terrible. Let's replay the rest of the draft showing total points rank:

<details markdown="1"><summary>- Draft and current player rankings by total points</summary>

| Image | Player | Team | Overall Pick #  | Points Rank   | Emoji |
| ---------------------------------------------------------------------------------------------- | ------------------ | ------------------------ | -- | --- | - |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3149391.png&h=40&cb=1) | A'ja Wilson        | Sonia Satoumayor         | 1  | 1   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433403.png&h=40&cb=1) | Caitlin Clark      | Lamdin's Layups          | 2  | 66  | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3917450.png&h=40&cb=1) | Napheesa Collier   | Derek's Double Dribblers | 3  | 4   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2998928.png&h=40&cb=1) | Breanna Stewart    | Hannah's Hot Shots       | 4  | 21  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3904577.png&h=40&cb=1) | Arike Ogunbowale   | Lefrak Attack            | 5  | 29  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4066533.png&h=40&cb=1) | Sabrina Ionescu    | Renick's Ringers         | 6  | 2   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2566106.png&h=40&cb=1) | Dearica Hamby      | Renick's Ringers         | 7  | 5   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4432831.png&h=40&cb=1) | Aliyah Boston      | Lefrak Attack            | 8  | 8   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529140.png&h=40&cb=1) | Alyssa Thomas      | Hannah's Hot Shots       | 9  | 11  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/1068.png&h=40&cb=1)    | Nneka Ogwumike     | Derek's Double Dribblers | 10 | 7   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433402.png&h=40&cb=1) | Angel Reese        | Lamdin's Layups          | 11 | 26  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3065570.png&h=40&cb=1) | Kelsey Plum        | Sonia Satoumayor         | 12 | 3   | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4281929.png&h=40&cb=1) | Satou Sabally      | Sonia Satoumayor         | 13 | 20  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2491205.png&h=40&cb=1) | Skylar Diggins     | Lamdin's Layups          | 14 | 13  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4398674.png&h=40&cb=1) | Rhyne Howard       | Derek's Double Dribblers | 15 | 35  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433404.png&h=40&cb=1) | Cameron Brink      | Hannah's Hot Shots       | 16 | 134 | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2999101.png&h=40&cb=1) | Jonquel Jones      | Lefrak Attack            | 17 | 40  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2987869.png&h=40&cb=1) | Jewell Loyd        | Renick's Ringers         | 18 | 34  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/869.png&h=40&cb=1)     | DeWanna Bonner     | Renick's Ringers         | 19 | 80  | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2998938.png&h=40&cb=1) | Kahleah Copper     | Lefrak Attack            | 20 | 82  | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433730.png&h=40&cb=1) | Paige Bueckers     | Hannah's Hot Shots       | 21 | 16  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3058895.png&h=40&cb=1) | Brionna Jones      | Derek's Double Dribblers | 22 | 17  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3058901.png&h=40&cb=1) | Allisha Gray       | Lamdin's Layups          | 23 | 5   | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4065870.png&h=40&cb=1) | Jackie Young       | Sonia Satoumayor         | 24 | 9   | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4420318.png&h=40&cb=1) | Ezi Magbegor       | Sonia Satoumayor         | 25 | 30  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3913881.png&h=40&cb=1) | Alanna Smith       | Lamdin's Layups          | 26 | 24  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2987891.png&h=40&cb=1) | Courtney Williams  | Derek's Double Dribblers | 27 | 15  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3904576.png&h=40&cb=1) | Marina Mabrey      | Hannah's Hot Shots       | 28 | 43  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3142191.png&h=40&cb=1) | Kelsey Mitchell    | Lefrak Attack            | 29 | 12  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529137.png&h=40&cb=1) | Natasha Cloud      | Renick's Ringers         | 30 | 31  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433630.png&h=40&cb=1) | Rickea Jackson     | Renick's Ringers         | 31 | 41  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2490553.png&h=40&cb=1) | Brittney Griner    | Lefrak Attack            | 32 | 54  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2988756.png&h=40&cb=1) | Brittney Sykes     | Hannah's Hot Shots       | 33 | 28  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3146151.png&h=40&cb=1) | Ariel Atkins       | Derek's Double Dribblers | 34 | 38  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529122.png&h=40&cb=1) | Chelsea Gray       | Lamdin's Layups          | 35 | 19  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529130.png&h=40&cb=1) | Natasha Howard     | Sonia Satoumayor         | 36 | 27  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433524.png&h=40&cb=1) | Sonia Citron       | Sonia Satoumayor         | 37 | 18  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529205.png&h=40&cb=1) | Kayla McBride      | Lamdin's Layups          | 38 | 36  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4398776.png&h=40&cb=1) | NaLyssa Smith      | Derek's Double Dribblers | 39 | 50  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3913903.png&h=40&cb=1) | Teaira McCowan     | Hannah's Hot Shots       | 40 | 116 | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4683006.png&h=40&cb=1) | Leonie Fiebich     | Lefrak Attack            | 41 | 60  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4066548.png&h=40&cb=1) | DiJonai Carrington | Renick's Ringers         | 42 | 59  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433405.png&h=40&cb=1) | Kamilla Cardoso    | Renick's Ringers         | 43 | 33  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4433408.png&h=40&cb=1) | Aaliyah Edwards    | Lefrak Attack            | 44 | 107 | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/918.png&h=40&cb=1)     | Tina Charles       | Hannah's Hot Shots       | 45 | 23  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3142328.png&h=40&cb=1) | Gabby Williams     | Derek's Double Dribblers | 46 | 14  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3907781.png&h=40&cb=1) | Sophie Cunningham  | Lamdin's Layups          | 47 | 57  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/1054.png&h=40&cb=1)    | Tiffany Hayes      | Sonia Satoumayor         | 48 | 55  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3142010.png&h=40&cb=1) | Azura Stevens      | Sonia Satoumayor         | 49 | 10  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2529183.png&h=40&cb=1) | Stefanie Dolson    | Lamdin's Layups          | 50 | 95  | 🔽 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/2566110.png&h=40&cb=1) | Julie Vanloo       | Derek's Double Dribblers | 51 | 115 | ⏬ |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4898384.png&h=40&cb=1) | Kiki Iriafen       | Hannah's Hot Shots       | 52 | 25  | 🔼 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/3142250.png&h=40&cb=1) | Jordin Canada      | Lefrak Attack            | 53 | 45  | 🟰 |
| ![](https://a.espncdn.com/combiner/i?img=/i/headshots/wnba/players/full/4398911.png&h=40&cb=1) | Shakira Austin     | Renick's Ringers         | 54 | 37  | 🔼 |

</details>

