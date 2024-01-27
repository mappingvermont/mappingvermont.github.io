---
layout: post
category : web
tags : [ballfields, osm, postgis]
title: Villages and Ballfields
description: "Using OSM to find ballfields and village centers"
---

I was reading about Irasburg today, and learned that from 1812 - 1886 it was the shire town of Orleans County. That made some sense to me - I've always thought it was a pretty grand place, up there on that plateau.\\
\\
One of the reasons I like it so much is the central ballfield on the town green. Lots of villages in Vermont have the town green, but few nestle a ballfield into the back corner.\\
\\
I got to thinking - is this the closest town center to a ballfield in all of Vermont? The town I grew up in - Grafton - also has a ballfield close by, but it's a little bit hidden, and up a few hundred feet from the store.\\
\\
Let's use OSM to try and help us answer this question.

## Data

First we'll use [overpass turbo](https://overpass-turbo.eu/) to export the OSM data.\\
\\
Places:
{% raw %}
```
[out:json][timeout:25];
node["place"]({{bbox}});
out geom;
```

Ballfields:
```
[out:json][timeout:25];
nwr["sport"="baseball"]["leisure"="pitch"]({{bbox}});
out geom;
```
{% endraw %}

We'll also download natural earth for a state of Vermont shape:

```
wget https://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_1_states_provinces.zip
unzip ne_10m_admin_1_states_provinces.zip
```

Then let's load everything into PostGIS:

```
ogr2ogr -f Postgresql "PG:dbname=charliehofmann" ne_10m_admin_1_states_provinces.shp \
  -where "name = 'Vermont'" -t_srs "EPSG:32145" -overwrite -lco GEOMETRY_NAME=geom -nln vermont
```

```
ogr2ogr -f Postgresql "PG:dbname=charliehofmann" ballfields.geojson -t_srs "EPSG:32145" \
  -lco GEOMETRY_NAME=geom -nln ballfields
ogr2ogr -f Postgresql "PG:dbname=charliehofmann" populated_place.geojson -t_srs "EPSG:32145" \
  -lco GEOMETRY_NAME=geom -nln place
```

## PostGIS

Now the fun part - let's find all the places and ballfields within Vermont, then find the top 10 that are closest to each other.

```sql
SELECT *
FROM (
  -- find the closest ballfield to each Vermont place,
  -- as well as the distance
  SELECT
     DISTINCT ON (vermont_place.ogc_fid) vermont_place.name, round(ST_Distance(vermont_place.geom, ballfields.geom)::decimal, 0)  as dist
  FROM ( -- Vermont places only
    select place.ogc_fid, place.name, place.geom
    FROM place
    JOIN vermont
    ON ST_Intersects(place.geom, vermont.geom)
  ) vermont_place, ballfields
  ORDER BY vermont_place.ogc_fid, ST_Distance(vermont_place.geom, ballfields.geom)
) place_ballfield_pairs
ORDER BY 2 -- order by distance to find the top 10 closest
LIMIT 10;
```

And the results:

|       name       | distance (m)  |
|------------------|------:|
| Irasburg         |  108  |
| Waterbury Center |  115  |
| South End (Burlington neighborhood)       |  116  |
| Lyndon Center    |  144  |
| Shelburne        |  160  |
| North Bennington |  166  |
| Quechee          |  171  |
| Fair Haven       |  171  |
| Newport Center   |  174  |
| Killington       |  198  |

## Irasburg: still undefeated 👑

OSM place point in yellow, OSM ballfield location in pink. If anything the 108 m measurement is too large - it really is right in _the_ center of town.\\
\\
![image](https://github.com/mappingvermont/tnrminutes/assets/5845672/49cab4fd-8cd3-4966-990e-aedfb5ee8def)

