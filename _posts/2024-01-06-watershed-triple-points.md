---
layout: post
category : web
tags : [watershed, postgis, raster]
title: Finding Watershed Triple Points
description: "Postgis for fun and profit"
---

Many years ago a friend shared the concept of watershed double points. These occur when adjacent watersheds have their highest point in close proximity to each other. This often occurs on mountain peaks - water that falls on one side goes to one river, the opposite side to another river. For high peaks, this area is often the highest point in both watersheds.\\
\\
Triple points - where three watersheds come together at their highest point - are much rarer. My friend seemed to think there were a few in Vermont, but he couldn't name the locations or the watersheds. Today while my kid was napping I decided to do a little analysis in postgis.

### Data

I grabbed the NHD dataset from [the National Map](https://www.usgs.gov/programs/national-geospatial-program/national-map) at [this link](https://prd-tnm.s3.amazonaws.com/StagedProducts/Hydrography/NHD/State/GPKG/NHD_H_Vermont_State_GPKG.zip), then used `ogr2ogr` to import the HUC10 layer into postgis, reprojecting to VT State Plane while doing so:

```bash
ogr2ogr -f Postgresql 'PG:user=charliehofmann' NHD_H_Vermont_State_GPKG.gpkg \
  WBDHU10 -nln huc10_vt -lco GEOMETRY_NAME=geom -overwrite -nlt PROMOTE_TO_MULTI \
  -t_srs EPSG:32145
```

HUC10 seemed to be the right level of specificity for this - plenty of watersheds with familiar names - Black River, Williams River, three branches of the White, etc.\\
\\
I then downloaded a 10m DEM from VCGI from [this link](https://maps.vcgi.vermont.gov/gisdata/vcgi/packaged_zips/ElevationDEM_DEM10M/_ALL_ElevationDEM_DEM10m.zip) and brought it into postgis with:

```bash
psql -c "create extension postgis_raster;"

raster2pgsql -Y -d -t 256x256 -N '-32768' -I -C -M -n "path" hdr.adf vt_dem_10 | psql
```

Hat tip to Matt Perry for the [canonical post on postgis raster analysis](https://www.perrygeo.com/zonal-stats-with-postgis-rasters-part-2.html) - I reference it whenever I need to deal with raster data.

### Analysis

First I needed to find the max elevation for each watershed - running zonal stats for my HUC10 geometries against the DEM.\\
\\
I'm not super familiar with the postgis raster functions, but again Matt's blog post was super helpful to get me started:

```sql
create table max_elevation_by_watershed as
select
  objectid,
  huc10_vt.name AS name,
  (ST_SummaryStatsAgg(ST_Clip(raster.rast, huc10_vt.geom, true), 1, true)).max as max_elevation
from
  vt_dem_10 as raster
inner join huc10_vt on
  ST_Intersects(huc10_vt.geom, raster.rast)
group by
  name, objectid;
```

I then had this nice table:

 objectid |                 name                 | max_elevation
----------|--------------------------------------|---------------
        1 | Headwaters Missisquoi River          |          3853
        2 | Sutton River-Missisquoi River        |          3413
        3 | Stevens River-Connecticut River      |          2684
        5 | First Branch White River             |          2327
        6 | Third Branch White River             |          3205


Next I needed to find where these max elevation pixels actually were in each watershed. I decided to use ST_Reclass to reclassify the DEM to only `1` for the max elevation pixel and `NODATA` for everything else.\\
\\
After finding each pixels that matched the max for each watershed, I converted them to points, then found the closest point to the watershed geometry in the event that any were just outside. Man, postgis is cool.

```sql
create table highest_point_by_watershed as
-- find a single point for each watershed, ordering by the distance to
-- the watershed geom.
-- as we're talking about tiles here, the reclass will likely have some
-- points outside the watershed geometry itself, but at least one that intersects
select distinct on (objectid) objectid, name, pt_geom as geom
from (
  select
    objectid,
    huc10_vt.name,
    huc10_vt.geom,
    (
      -- dump the pixels with data (in this case the max pixels) to points
      ST_PixelAsPoints(ST_Reclass(
        rast,
        1,
        -- dynamically reclassify the raster based on the max value for that watershed
        '0-' || (max_elevation - 1) || ':-32768, ' || max_elevation || ':1,' || (max_elevation + 1) || '-10000:-32768',
        '16BSI',
        -32768), 1, true
      )
    ).geom pt_geom
  from vt_dem_10
  -- filter the huc10_vt raster to the tiles that intersect each watershed
  join huc10_vt on ST_Intersects(geom, rast)
  join max_elevation_by_watershed using (objectid)
) reclassed
order by objectid, ST_Distance(pt_geom, geom);
```

Finally, cluster the watershed points to find groups of three within 100 ft.

```sql
select json_build_object(
  'type', 'FeatureCollection',
  'features', json_agg(ST_AsGeoJSON(clustered.*)::json)
)
from (
  select name, ST_Transform(geom, 4326),
    ST_ClusterDBSCAN(geom, eps := 100, minpoints := 3) over () AS cid
  from highest_point_by_watershed
) clustered
where cid is not null; -- filter out non-clustered points
```

### Results

We did it! There are [three triple point locations](http://geojson.io/#data=data:application/json,%7B%22type%22%3A%22FeatureCollection%22%2C%22features%22%3A%5B%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-71.988277192%2C44.766335462%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22East%20Branch%20Passumpsic%20River%22%2C%22cid%22%3A0%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.325460493%2C44.206322108%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Waits%20River%22%2C%22cid%22%3A1%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.324960025%2C44.206321341%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Wells%20River%22%2C%22cid%22%3A1%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-71.988276397%2C44.766425448%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Clyde%20River%22%2C%22cid%22%3A0%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-71.988529822%2C44.766336593%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Barton%20River%22%2C%22cid%22%3A0%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.815345908%2C44.543146855%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Browns%20River%22%2C%22cid%22%3A2%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.814343103%2C44.543869569%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Little%20River-Winooski%20River%22%2C%22cid%22%3A2%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.325960168%2C44.206592869%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Headwaters%20Winooski%20River%22%2C%22cid%22%3A1%7D%7D%2C%7B%22type%22%3A%22Feature%22%2C%22geometry%22%3A%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B-72.814467971%2C44.543689238%5D%7D%2C%22properties%22%3A%7B%22name%22%3A%22Gihon%20River-Lamoille%20River%22%2C%22cid%22%3A2%7D%7D%5D%7D) within the state of Vermont!\\
\\
There's the Winooski / Browns / Lamoille River triple point just north of the nose on Mount Mansfield:
![](/images/winooski_browns_lamoille.png)\\
\\
The Barton / Clyde / Passumpsic on Bald Mountain:
![](/images/barton_clyde_passumpsic.png)\\
\\
And maybe my personal favorite, the Waits / Wells / Winooski:
![](/images/waits_wells_winooski.png)\\
\\
Thanks for playing everyone! Please direct any further Vermont geographical puzzles my way . . . between VCGI's data and PostGIS we should be able to answer a lot of them!
