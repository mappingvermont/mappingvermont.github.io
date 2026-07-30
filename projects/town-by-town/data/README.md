# Data

- `raw/VT_Town_Boundaries.geojson` — original source file, kept for reference/reprocessing. Not used by the app.
- `towns_simplified.geojson` — simplified town boundaries (name + geometry only) used by the app for town outlines/click targets.
- `vermont.pmtiles` (~119 MB) — **not committed to git.** Hosted on S3: `https://mapping-vt-tiles.s3.amazonaws.com/vermont.pmtiles` (public-read bucket policy + CORS enabled, so the PMTiles JS client can read range-request responses cross-origin from the GitHub Pages origin).

  Regenerate with:
  ```
  pmtiles extract https://build.protomaps.com/<DATE>.pmtiles vermont.pmtiles \
    --bbox=-73.9,42.5,-71.2,45.3 \
    --maxzoom=14
  ```
  Then re-upload to the `mapping-vt-tiles` S3 bucket at key `vermont.pmtiles`.
