---
layout: post
category : web
tags : [historic, sites, roads]
title: Mapping Vermont's historic markers
description: "Finding the roadside marker furthest from a road"
---

I was skating at the sea caves today, and read that [they may have been used to hide loot](https://enjoyburlington.com/arthur-park/) during the [Black Snake Affair](https://vermonthistory.org/black-snake-affair). This reminded me of the Black Snake Affair historic site marker - alongside the Winooski River deep in the Ethan Allen homestead. Unlike so many VT historic markers, it feels comically far from anything "important" today. It got me thinking - what's the furthest "roadside" historic site marker from a road today?\\
\\
The VT Division for Historic Preservation now has [their own map](http://roadsidemarkers.vermont.gov/) of historic markers- much more thorough than my own [2015 effort](/general/2015/02/08/Vermonts-Historic-Sites/) to map this data.\\
\\
I downloaded it from their server with:

```
curl https://services1.arcgis.com/rnCtPMpypTkqwvYT/arcgis/rest/services/VT_RoadsideMarkers/FeatureServer/0/query\?f\=json\&where\=1%3D1\&returnGeometry\=true\&spatialRel\=esriSpatialRelIntersects\&geometry\=%7B%22xmin%22%3A-10271630.4075066%2C%22ymin%22%3A4346196.359767948%2C%22xmax%22%3A-6526827.51776024%2C%22ymax%22%3A6014358.065063191%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%7D%7D\&geometryType\=esriGeometryEnvelope\&inSR\=102100\&outFields\=Long_%2CLat%2Cname%2Cdescription%2Cpic_url%2Cthumb_url%2Cwebsite%2Cshortlist_id%2Cnumber_%2Ctab_id%2Cset_%2Ctown%2Ccounty%2Caddress%2Cvideo_url%2Ccoordinates%2Ccoordinates_X%2Ccoordinates_Y%2Clocation%2CTAB_NAME%2COrganization%2CTheme%2CFY%2CCastDate%2CYear%2CATTACHMENT_1%2CATTACHMENT_2%2COBJECTID\&outSR\=102100 > markers.geojson
```

And the imported it into PostGIS:

```
ogr2ogr -f Postgresql "PG:dbname=charliehofmann" markers.geojson -lco GEOMETRY_NAME=geom -nln historic_markers  -t_srs EPSG:32145
```

Next I grabbed VT road data from VCGI and loaded it:

```
curl https://opendata.arcgis.com/api/v3/datasets/1dee5cb935894f9abe1b8e7ccec1253e_39/downloads/data?format=geojson&spatialRefId=4326&where=1%3D1 > roads.geojson

ogr2ogr -f Postgresql "PG:dbname=charliehofmann" roads.geojson -lco GEOMETRY_NAME=geom -nln vt_roads -s_srs EPSG:4326 -t_srs EPSG:32145
```

I then ran a nearest neighbor query to find the distance of each marker to the closest road:

```sql
select *
from (
  select 
     distinct on (historic_markers.objectid) historic_markers.objectid, 
     historic_markers.name, 
     historic_markers.description,
     historic_markers.geom,
     ST_Distance(historic_markers.geom, vt_roads.geom)  as dist
  from historic_markers, vt_roads
  where ST_DWithin(historic_markers.geom, vt_roads.geom, 10000)
  order by historic_markers.objectid, ST_Distance(historic_markers.geom, vt_roads.geom)
) nearest_road
order by 5 desc;
```

I'd set a max distance of 10 kilometers to speed up the query - surely the upper limit for a marker's distance from a road given Vermont's dense settlement pattern. With that limit however I only returned 309 of the 310 markers in the dataset. A left join showed me that the furthest VT Historic Roadside Marker is actually 370 miles away- honoring the Vermont soliders who fought at the battle of Civil War battle of Cedar Creek. Pretty cool!\\
\\
That marker aside, the top three furthest markers from roads are as follows:

| Marker | Location | Distance from road |
| --- | --- | --- |
| The Black Snake Affair | On the Winooski River, Ethan Allen Homestead | 928 feet |
| The Fisk Trophy Race of 1937 | Top of the Saskadena Six ski area | 875 feet |
| Vermont Veteran's Home | Bennington | 367 feet |

Not too bad for a quick blog post during a toddler's nap! Fun to learn that VT has placed a historical marker in VA, and about the [Fisk Trophy Race](https://www.skirunners.org/calendar/2018/1/24/fisk-trophy-race) too! Until next time, happy mapping!
