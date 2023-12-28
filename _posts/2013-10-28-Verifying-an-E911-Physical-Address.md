---
layout: post
title: Verifying an E911 Physical Address
description: "Leveraging Vermont's buildings dataset to improve user-submitted address data."
modified: 2013-10-28
category : web
tags : [Leaflet, php, GeoJSON]
---

I've been processing a lot of user-supplied Vermont physical address data at work lately. We usually geocode this data and then aggregate it up to town, zipcode, or county units for analysis and display. This data is often statewide, and comes from a variety of web forms- users visit a website, provide some information, and give their physical address.\\
\\
Most of these entry forms make clear the difference between a mailing address and a physical address. A mailing address is where you get your mail- it can be anything from a street and house number to a P.O. Box and post office. A physical address is meant to describe your physical location. In Vermont, address numbers are on every building, and VCGI has a great public dataset of these addresses.\\
\\
Looking through these user-submitted physical addresses, however, there are all manner of addresses. Some enter P.O. Boxes, some enter road names with no address numbers, some appear to enter correct address number and street combinations. Given the range of inputs, it's clear that some type of form validation is needed. How great would it be to have the correct physical location of this data? To develop an application that allows users to type in their town name, then maps the E911 points in their town and lets them zoom in and pick their house? After talking about this at length with my coworkers one day, I went home, determined to put together a "quick little app" to accomplish this task.\\
\\
And, 5+ months later, it works! Huzzah! Turns out that dynamically mapping 300,000 points is a little harder than initially realized. More on the technical stuff later, but in short, an autocomplete form passes the town name to a MySQL database of E911 points, returning a GeoJSON array of that towns points, which are mapped using Leaflet.js. Here it is:\\
\\
[http://mappingvermont.org/projects/e911/](/projects/e911/)
