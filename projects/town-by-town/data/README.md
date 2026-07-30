# Data

- `raw/VT_Town_Boundaries.geojson` — original source file, kept for reference/reprocessing. Not used by the app.
- `towns_simplified.geojson` — simplified town boundaries (name + geometry only) used by the app for town outlines/click targets.
- `vermont.pmtiles` — **not committed to git.** Hosted as a GitHub Release asset: https://github.com/mappingvermont/mappingvermont.github.io/releases/download/town-by-town-basemap-v1/vermont.pmtiles

  Regenerate with:
  ```
  pmtiles extract https://build.protomaps.com/<DATE>.pmtiles vermont.pmtiles \
    --bbox=-73.9,42.5,-71.2,45.3 \
    --maxzoom=14
  ```
