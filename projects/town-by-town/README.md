# Town by Town

A map tracking [Vermont Public](https://www.vermontpublic.org)'s *Vermont Edition: Town by Town* series, which spotlights a different Vermont town or city each month. Click an episode in the list (or a highlighted town on the map) to zoom in and read a summary, with a link out to the full segment on vermontpublic.org.

Live demo: `/projects/town-by-town/`

## Stack

Plain HTML/CSS/JS, no build step or bundler — consistent with the other projects in this repo. Loaded via CDN:

- [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) `5.24.0` — chosen over Leaflet for smooth animated `flyTo`/`fitBounds` camera moves and native vector tile rendering. **Pinned to the 5.x line deliberately**: v6 dropped the UMD `dist/maplibre-gl.js` browser bundle in favor of ESM-only, which doesn't work as a plain `<script>` tag without a bundler.
- [PMTiles](https://protomaps.com/docs/pmtiles) `4.4.1` — a single static file format for vector tiles, servable from any static host (no tile server needed). Imported via `https://esm.sh/pmtiles@4.4.1` rather than unpkg's raw ESM build, because that build has an unresolved bare `import "fflate"` that only works with a bundler; esm.sh resolves and inlines dependencies for direct browser use.
- [`@protomaps/basemaps`](https://github.com/protomaps/basemaps) `5.7.2` — generates the MapLibre style/layers for a Protomaps-schema basemap (the `light` flavor).

## Basemap: PMTiles approach

The basemap is a single `.pmtiles` file containing OpenStreetMap-derived vector tiles, built with the following pipeline:

1. **Source**: [Protomaps' daily planet build](https://docs.protomaps.com/basemaps/downloads) (~120–140GB, hosted at `build.protomaps.com`).
2. **Extraction**: rather than downloading the planet file, `pmtiles extract` pulls just the tiles we need directly over HTTP range requests (see [PMTiles CLI](https://docs.protomaps.com/pmtiles/cli)) — a few seconds and ~100-150MB transferred instead of 120GB+.
3. **Two-tier merge, to avoid blank tiles at low zoom**: a single narrow extract around Vermont looked fine when *zoomed into* the state, but at the initial statewide zoom on a wide desktop window, `fitBounds` zooms out to fit the viewport's aspect ratio — and Vermont's bounding box (tall/narrow) doesn't match a typical landscape browser window (wide/short). The result was visible blank tiles on the left/right edges, because those tiles simply didn't exist in a narrowly-clipped extract. Low zoom levels are cheap regardless of area (few tiles exist at z0–z8 globally), so the fix is two extracts merged into one file:
   - **Wide context layer**: bbox roughly covering New England + eastern NY + southern Quebec, zooms **0–8** (~12MB).
   - **Vermont detail layer**: a tighter bbox around Vermont with a buffer, zooms **9–14** (~116MB) — the buffer prevents blank edges when zoomed into border towns.
   - Merged with `pmtiles merge` (the two inputs have disjoint zoom ranges, so no tile conflicts).

   Regenerate with:
   ```
   pmtiles extract https://build.protomaps.com/<DATE>.pmtiles context_low.pmtiles \
     --bbox=-80,40,-66,48 --minzoom=0 --maxzoom=8

   pmtiles extract https://build.protomaps.com/<DATE>.pmtiles vermont_detail.pmtiles \
     --bbox=-73.9,42.5,-71.2,45.3 --minzoom=9 --maxzoom=14

   pmtiles merge context_low.pmtiles vermont_detail.pmtiles vermont.pmtiles
   ```

## Hosting the pmtiles file: why S3, not GitHub

The pmtiles file (~130MB) is **not committed to this repo** and **not served from GitHub Pages/Releases**. Two dead ends worth remembering if revisiting this:

- **GitHub Releases** can host large binary assets, but release-asset downloads don't send CORS headers (confirmed by inspecting the response chain). The PMTiles JS client can't read the range-request responses cross-origin from the browser, even though `curl`/`gh` fetch the file fine (those ignore CORS).
- **Committing directly to the repo** and serving via GitHub Pages (same-origin, so no CORS issue, and Pages' Fastly CDN does support byte-range requests) was the initial fallback — but GitHub hard-rejects any single committed file over 100MB, which forced capping the basemap at a lower zoom/detail level than desired.

Landed on **S3** instead: no file size ceiling, byte-range requests supported natively, and CORS can be configured on the bucket. Hosted at `mapping-vt-tiles.s3.amazonaws.com/vermont.pmtiles`, bucket policy set to public-read, CORS rule allows `GET` from any origin. Cost is negligible at this file size and traffic level (a few cents/month).

`data/vermont.pmtiles` is gitignored; see `data/README.md` for regeneration + upload instructions.

## Data files

- `data/towns_simplified.geojson` — all 256 Vermont towns/cities/gores, trimmed to just `TOWNNAME` + geometry, **clipped to the official state boundary** and simplified (`mapshaper -simplify visvalingam keep-shapes 10%`, ~373KB). Town names are title-cased (not `ALL CAPS`, the source format) and used as the join key against `episodes.json`.
- `data/vt_boundary.geojson` — the state boundary itself, as a single simplified `MultiLineString`, drawn as an outline layer over the towns/basemap.
- `data/episodes.json` — one entry per episode: `town` (must exactly match a `TOWNNAME` in the geojson), `date`, `url` (link to the vermontpublic.org episode page), and `summary` (2–3 sentence blurb, pulled from each episode's article page).
- `data/raw/VT_Town_Boundaries.geojson` — original unprocessed source file, kept for reference in case the simplified version ever needs regenerating differently.

Both `towns_simplified.geojson` and `vt_boundary.geojson` are generated from a local PostGIS `vt` table (Mapbox Boundaries state polygon), so the town shapes and the boundary line agree with each other exactly — see `data/README.md` for the full regeneration pipeline (clip via `ST_Intersection`, then simplify with mapshaper).

## Map/panel interaction

- **Desktop**: fixed-width sidebar on the left; episode list, or an expanded detail view (town, date, summary, link) when one is selected.
- **Mobile**: the same panel becomes a bottom sheet that can be tapped to collapse to a peek height or expanded — same list/detail content, no separate mobile-specific markup.
- Clicking an episode **either in the list or directly on a highlighted town on the map** does the same thing: `fitBounds` to that town's full polygon and expands the panel to the detail view.
- `fitBounds` padding is **asymmetric and panel-aware** — it accounts for the sidebar's actual width (desktop) or the bottom sheet's height (mobile) so the zoomed-to town isn't hidden behind the panel. The initial statewide view uses tighter padding than the per-town zoom, for a closer starting view.
- Town highlighting uses MapLibre `feature-state`: all 11 featured towns get a subtle fill/outline on load (`visited`), and the currently-selected one gets a bolder treatment (`selected`) — driven by `promoteId: "TOWNNAME"` on the source so feature state can be set/queried by name instead of numeric feature id.

## Branding

Colors, font, and logo are Vermont Public's actual brand — pulled from their live site's CSS custom properties (`--headerBgColor: #004c42`, `--linkColor: #00807f`, `--bodyFont: 'Poppins'`) and their official horizontal logo (the "lighttype" variant, designed for dark backgrounds, matching this project's dark green panel header). Used with direct authorization, since this project may end up hosted on/linked from Vermont Public's own site.

## Known limitations / possible follow-ups

- Adding a new episode currently means manually editing `episodes.json` — fine at a once-a-month cadence, not built for higher frequency.
- No handling yet for a town that hasn't been simplified correctly or is missing from the source geojson (all 11 current episode towns were verified to match; a mismatch would silently fail to highlight/zoom without an error message).
