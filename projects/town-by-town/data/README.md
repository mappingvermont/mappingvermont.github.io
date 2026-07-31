# Data

- `raw/VT_Town_Boundaries.geojson` — original source file, kept for reference/reprocessing. Not used by the app.
- `towns_simplified.geojson` — town boundaries (name + geometry only) used by the app for town outlines/click targets, **clipped to the state boundary** (see below) and simplified. Town names are title-cased (source is `ALL CAPS`) and used as the join key against `episodes.json`.
- `vt_boundary.geojson` — a single simplified `MultiLineString` of Vermont's outer state boundary, used for the boundary line layer.
- `episodes.json` — one entry per episode, keyed by town name.
- `vermont.pmtiles` (~119 MB) — **not committed to git.** Hosted on S3: `https://mapping-vt-tiles.s3.amazonaws.com/vermont.pmtiles` (public-read bucket policy + CORS enabled, so the PMTiles JS client can read range-request responses cross-origin from the GitHub Pages origin).

  Regenerate with:
  ```
  pmtiles extract https://build.protomaps.com/<DATE>.pmtiles vermont.pmtiles \
    --bbox=-73.9,42.5,-71.2,45.3 \
    --maxzoom=14
  ```
  Then re-upload to the `mapping-vt-tiles` S3 bucket at key `vermont.pmtiles`.

## Clipping towns to the state boundary, and generating the boundary line

`raw/VT_Town_Boundaries.geojson`'s town polygons don't line up exactly with the official state boundary (small gaps/overlaps at the edge). Both `towns_simplified.geojson` and `vt_boundary.geojson` are derived from a local PostGIS `vt` table (Mapbox Boundaries `adm1` polygon for Vermont, in a local `charlie` database) so the two layers agree with each other. Regenerate with:

```bash
# 1. Load the raw town polygons into postgres
ogr2ogr -f PostgreSQL "PG:dbname=charlie" raw/VT_Town_Boundaries.geojson \
  -nln vt_towns_raw -nlt PROMOTE_TO_MULTI -lco GEOMETRY_NAME=geom

# 2. Clip each town polygon to the vt state boundary
psql -d charlie -c "
  DROP TABLE IF EXISTS vt_towns_clipped;
  CREATE TABLE vt_towns_clipped AS
  SELECT
    t.townname AS \"TOWNNAME\",
    ST_Multi(ST_CollectionExtract(ST_Intersection(ST_MakeValid(t.geom), v.geom), 3)) AS geom
  FROM vt_towns_raw t
  JOIN vt v ON ST_Intersects(t.geom, v.geom);
"

# 3. Export the clipped towns, title-case TOWNNAME, and simplify
ogr2ogr -f GeoJSON raw/vt_towns_clipped.geojson "PG:dbname=charlie" \
  -sql "select \"TOWNNAME\", geom from vt_towns_clipped"

mapshaper raw/vt_towns_clipped.geojson \
  -simplify visvalingam keep-shapes 10% \
  -each 'TOWNNAME = TOWNNAME.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase())' \
  -filter-fields TOWNNAME \
  -o towns_simplified.geojson force

# 4. Export the state boundary polygon, simplify, and convert to a boundary line
ogr2ogr -f GeoJSON raw/vt_boundary.geojson "PG:dbname=charlie" \
  -sql "select name, geom from vt"

mapshaper raw/vt_boundary.geojson \
  -simplify visvalingam 5% \
  -lines \
  -each 'this.properties = {name: "Vermont"}' \
  -o vt_boundary.geojson format=geojson force

# 5. Clean up the intermediate postgres tables and exports
psql -d charlie -c "drop table if exists vt_towns_raw; drop table if exists vt_towns_clipped;"
rm raw/vt_towns_clipped.geojson raw/vt_boundary.geojson
```

Step 3 uses `keep-shapes` (guarantees every one of the 256 towns keeps a valid, non-collapsed shape) — the clip against the real (jaggier) state boundary adds vertices near the state edge that don't simplify away as cleanly as the original unclipped source, so the output is larger than before (~373KB vs. ~161KB) despite the same simplification %.
