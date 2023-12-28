##Mapping Holiday Cards

A project to map my holiday card list, including moving markers to show how people change location between years.

From the blog:
I’ve been sending holiday cards since college, and have been keeping formal track of my list since 2013. This year I decided to geocode my card list to analyze where I’ve been sending my cards and where people have moved.

I started with a CSV of all addresses, then geocoded it using a python script. I initially wrote the output to geoJSON, but ended up creating custom JSON to better describe the relationships at play– humans that receive one card per year at a particular place. From here I brought it into Leaflet, and using the Leafet Moving Marker plugin, animated people that have changed locations from year to year.

Final product: http://www.mappingvermont.org/projects/holiday-cards/
