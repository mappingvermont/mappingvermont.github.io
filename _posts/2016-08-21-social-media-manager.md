---
layout: post
category : web
tags : [python, slack, social-media]
title: Social Media and Python
description: "Scraping the web and posting to Twitter and Slack"
---

Until recently, my girlfriend produced podcasts for the New Republic. In addition to her work on [Primary Concerns](https://newrepublic.com/authors/primary-concerns) and [Intersection](https://newrepublic.com/tags/intersection), she also helped manage TNR's social media presence.\\
\\
A large part of her social media work was watching TNR's [minutes](http://newrepublic.com/minutes) site for new content. For each new minute, she would copy the headline, grab the associated image, and add them to [Buffer](https://buffer.com/), the app TNR uses to schedule its tweets. This isn't the most thrilling work, and can be downright annoying when trying to edit a podcast on a deadline.\\
\\
To help automate this process, I wrote some code to:

- Scrape the TNR Minutes page once per minute
- Compare this data to previous posts saved in a local SQLite database
- Identify new posts based on the unique minute ID
- If a new post was found, compose a tweet with the headline and image
- Post the tweet to Buffer, and send her a Slack message of the tweet

Not the most captivating of projects (where are the maps??), but cool to build something that makes my girlfriend's life easier. We also integrated a [Google Sheet](https://docs.google.com/spreadsheets/d/1t0wCIi_ZV4mHFyGyQs3DqidCSUZD4pifj74IedKMVr0/edit#gid=0) to pass environment variables to the app. Using the Google Doc, she could turn the system on/off and edit the time delay for the tweets.\\
\\
I love building projects that meet the user where they're at-- writing custom code to integrate with their end product while communicating to them through familiar systems like Slack and Google Sheets. If you're interested, the code is [here](https://github.com/mappingvermont/tnrminutes) on GitHub.
