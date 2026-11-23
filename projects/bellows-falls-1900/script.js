// Protomaps extract of the village only, to z15: the statewide vermont.pmtiles stops at z14, which has
// almost no building footprints. Regenerate with the command in ../README.md.
const PMTILES_URL = new URL("data/bellows_falls.pmtiles", window.location.href).href;
const SANBORN_TILES = "https://mapping-vt-tiles.s3.amazonaws.com/sanborn/{z}/{x}/{y}.png";
const SANBORN_BOUNDS = [-72.48, 43.115, -72.42, 43.16]; // Bellows Falls only; the tileset covers other towns too
// The map can't pan or zoom out past this. It must stay inside the pmtiles extract (-72.50,43.10,-72.40,43.17).
const MAX_BOUNDS = [-72.49, 43.105, -72.41, 43.165];
const CENSUS_URL = "data/census_1900.geojson";
const TOTAL_SHEETS = 87; // census page sides in ED 259
const ADULT_OVER = 16; // must match build_site_data.py

// The extract is small (~1 MB), so fetch it once and read tiles from memory. That works on any static
// server, including ones without HTTP range requests (python -m http.server).
class BufferSource {
	constructor(url) {
		this.url = url;
		this.buffer = fetch(url).then((r) => r.arrayBuffer());
	}
	getKey() {
		return this.url;
	}
	async getBytes(offset, length) {
		return { data: (await this.buffer).slice(offset, offset + length) };
	}
}

const protocol = new pmtiles.Protocol();
protocol.add(new pmtiles.PMTiles(new BufferSource(PMTILES_URL)));
maplibregl.addProtocol("pmtiles", protocol.tile);

const hadHashOnLoad = Boolean(window.location.hash); // read before the map writes its own
const isMobile = () => window.matchMedia("(max-width: 768px)").matches;
const panel = document.getElementById("panel");
const detail = document.getElementById("detail-body");

function mapPadding() {
	if (isMobile()) {
		return { top: 56, right: 30, bottom: window.innerHeight * 0.62 + 20, left: 30 };
	}
	return { top: 60, right: 40, bottom: 40, left: panel.offsetWidth + 40 };
}

const map = new maplibregl.Map({
	container: "map",
	style: {
		version: 8,
		glyphs: "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
		sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
		sources: {
			protomaps: {
				type: "vector",
				url: `pmtiles://${PMTILES_URL}`,
				attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
			},
			sanborn: {
				type: "raster",
				tiles: [SANBORN_TILES],
				tileSize: 256,
				bounds: SANBORN_BOUNDS,
				minzoom: 14,
				maxzoom: 21,
				attribution: 'Sanborn Map Co. 1896, <a href="https://www.loc.gov/collections/sanborn-maps/">Library of Congress</a>',
			},
		},
		layers: [
			...basemaps.layers("protomaps", basemaps.namedFlavor("light"), { lang: "en" }),
			{ id: "sanborn", type: "raster", source: "sanborn", paint: { "raster-opacity": 0.85, "raster-fade-duration": 150 } },
		],
	},
	center: [-72.4441, 43.1338],
	zoom: 16.5,
	minZoom: 13,
	maxZoom: 21,
	maxBounds: MAX_BOUNDS,
	hash: true,
	attributionControl: false,
});

map.addControl(new maplibregl.NavigationControl(), "top-right");
map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-right");

// MapLibre expands the compact attribution once its sources report attribution text.
// Collapse it the first time that happens; the ⓘ button still opens it.
// (Relies on MapLibre's class names: recheck after upgrading.)
const attrib = map.getContainer().querySelector(".maplibregl-ctrl-attrib");
function collapseAttribution() {
	if (!attrib.classList.contains("maplibregl-compact")) return;
	attrib.classList.remove("maplibregl-compact-show");
	map.off("styledata", collapseAttribution);
	map.off("sourcedata", collapseAttribution);
}
map.on("styledata", collapseAttribution);
map.on("sourcedata", collapseAttribution);

// --- Helpers ---

function escapeHtml(s) {
	return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Every country tied for the most residents over 16.
function topCountries(p) {
	const max = p.birth_counts[0]?.n;
	return p.birth_counts.filter((c) => c.n === max);
}
const flagString = (p) => topCountries(p).map((c) => c.flag).join("") || "🏠";
const flagTitle = (p) => topCountries(p).map((c) => c.country).join(" / ");
// Residents over 16 born in `country` (0 if none).
const countIn = (p, country) => p.birth_counts.find((c) => c.country === country)?.n ?? 0;
const matchesFilter = (f) => !filter || countIn(f.properties, filter) > 0;
const headcount = (p) => `${p.people} ${p.people === 1 ? "person" : "people"} · ${p.adults} over ${ADULT_OVER}`;

// --- State ---

let houses = [];
let selected = null; // the selected feature
let filter = null; // country name, or null for every house
const pins = new Map(); // address -> marker element

// --- Markers ---

function buildMarkers() {
	houses.filter((f) => f.geometry).forEach((f) => {
		// MapLibre positions markers by setting `transform` on this outer element every frame,
		// so it must stay unstyled. The visible pill (with its hover/selected scaling) is a child.
		const el = document.createElement("div");
		el.className = "house-marker-anchor";
		el.innerHTML = `<div class="house-marker" title="${escapeHtml(f.properties.address)}: ${escapeHtml(flagTitle(f.properties))}">${flagString(f.properties)}</div>`;
		el.addEventListener("click", (e) => {
			e.stopPropagation();
			selectHouse(f);
		});
		new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat(f.geometry.coordinates).addTo(map);
		pins.set(f.properties.address, el);
	});
}

// --- List ---

function renderList() {
	const list = document.getElementById("house-list");
	const byStreet = {};
	houses.filter(matchesFilter).forEach((f) => (byStreet[f.properties.street] ??= []).push(f));
	const num = (f) => Number(f.properties.house_num) || Infinity; // unnumbered last

	list.innerHTML = Object.keys(byStreet)
		.sort()
		.map((street) => {
			const rows = byStreet[street]
				.sort((a, b) => num(a) - num(b))
				.map(({ properties: p, geometry }) => `
					<div class="house-row${p.address === selected?.properties.address ? " active" : ""}" data-address="${escapeHtml(p.address)}">
						<div class="flags" title="${escapeHtml(flagTitle(p))}">${flagString(p)}</div>
						<div>
							<div class="addr">${escapeHtml(p.address)}</div>
							<div class="sub">${headcount(p)}${filter ? ` · ${countIn(p, filter)} born in ${escapeHtml(filter)}` : ""}${geometry ? "" : " · not on the map"}</div>
						</div>
					</div>`)
				.join("");
			const named = /\b(Avenue|Terrace|Place|Court|Ct|Park|Island|Hill)$/.test(street);
			const heading = street === "Square" ? "The Square" : named ? street : `${street} Street`;
			return `<div class="street-heading">${escapeHtml(heading)}</div>${rows}`;
		})
		.join("");

	list.querySelectorAll(".house-row").forEach((row) => {
		row.addEventListener("click", () => selectHouse(houses.find((f) => f.properties.address === row.dataset.address)));
	});
}

// --- Country filter ---

function renderFilter() {
	const tally = new Map(); // country -> { flag, houses, people }
	houses.forEach(({ properties: p }) => p.birth_counts.forEach((c) => {
		const t = tally.get(c.country) ?? { flag: c.flag, houses: 0, people: 0 };
		t.houses += 1;
		t.people += c.n;
		tally.set(c.country, t);
	}));
	const chip = (country, flag, label, title) => `
		<button class="filter-chip${filter === country ? " on" : ""}" data-country="${escapeHtml(country ?? "")}"
			aria-pressed="${filter === country}" title="${escapeHtml(title)}">${flag ? `<span class="flag">${flag}</span>` : ""}${escapeHtml(label)}</button>`;

	const el = document.getElementById("country-filter");
	el.innerHTML = chip(null, "", `All · ${houses.length}`, "Show every house")
		+ [...tally].sort((a, b) => b[1].houses - a[1].houses)
			.map(([country, t]) => chip(country, t.flag, `${country} · ${t.houses}`,
				`${t.houses} ${t.houses === 1 ? "house" : "houses"} with someone over ${ADULT_OVER} born in ${country} (${t.people} people)`))
			.join("");
	el.querySelectorAll(".filter-chip").forEach((b) => {
		b.addEventListener("click", () => setFilter(b.dataset.country || null));
	});
}

function setFilter(country) {
	filter = country;
	houses.filter((f) => f.geometry).forEach((f) => {
		const el = pins.get(f.properties.address);
		const show = matchesFilter(f);
		el.style.display = show ? "" : "none";
		el.firstElementChild.innerHTML = show && filter
			? `${f.properties.birth_counts.find((c) => c.country === filter).flag}<span class="n">${countIn(f.properties, filter)}</span>`
			: flagString(f.properties);
	});
	renderFilter();
	renderList();
	document.getElementById("house-list").scrollTop = 0;
}

// --- Detail ---

function renderDetail(f) {
	const p = f.properties;
	const top = new Set(topCountries(p).map((c) => c.country));
	const chips = p.birth_counts
		.map((c) => `<span class="tally-chip ${top.has(c.country) ? "top" : ""}">${c.flag} ${escapeHtml(c.country)} · ${c.n}</span>`)
		.join("");

	const residents = p.residents
		.map((r) => {
			const sex = { F: "female", M: "male" }[r.sex] ?? escapeHtml(r.sex);
			const parents = r.father_bp || r.mother_bp
				? ` · father ${escapeHtml(r.father_bp || "?")}, mother ${escapeHtml(r.mother_bp || "?")}`
				: "";
			return `
				<li class="resident ${r.adult ? "" : "minor"}">
					<div class="flag">${r.birth_flag}</div>
					<div>
						<div class="who">${escapeHtml(r.name)}${r.adult ? "" : '<span class="tag">under 17</span>'}${r.uncertain ? '<span class="tag unsure" title="Part of this row was hard to read">unsure</span>' : ""}</div>
						<div class="what">${escapeHtml(r.relation)} · ${sex}, ${r.age ? escapeHtml(r.age) : "age not given"}
							· born ${escapeHtml(r.birthplace || "?")}${parents}
							${r.occupation ? `<br>${escapeHtml(r.occupation)}` : ""}</div>
					</div>
				</li>`;
		})
		.join("");

	const placement = !f.geometry
		? p.house_num
			? "Today's map has no match for this address (the street may have been renamed), so this household isn't on the map."
			: "No house number was written on the census page, so this household isn't on the map."
		: p.geocode_confidence === "exact"
			? "Placed at today's address of the same number. House numbers and street names may have changed since 1900."
			: "Placed approximately: today's map has no exact match for this house number.";

	detail.innerHTML = `
		<div class="detail-flags">${flagString(p)}</div>
		<h2 class="detail-address">${escapeHtml(p.address)}</h2>
		<div class="detail-meta">${headcount(p)} · census sheet ${p.sheets.join(", ")}</div>
		<div class="detail-tally">${chips}</div>
		<ul class="detail-residents">${residents}</ul>
		<p class="fineprint">${placement} Only people over ${ADULT_OVER} count toward the flag.</p>`;
}

// --- Selection ---

function setSelected(f) {
	pins.get(selected?.properties.address)?.classList.remove("selected");
	pins.get(f?.properties.address)?.classList.add("selected");
	document.querySelectorAll(".house-row").forEach((row) => {
		row.classList.toggle("active", row.dataset.address === f?.properties.address);
	});
	selected = f;
}

function selectHouse(f) {
	setSelected(f);
	renderDetail(f);
	document.getElementById("house-detail").scrollTop = 0; // a new house starts at its top
	panel.classList.add("showing-detail");
	panel.classList.remove("peek");

	if (f.geometry) {
		map.easeTo({ center: f.geometry.coordinates, zoom: Math.max(map.getZoom(), 18), padding: mapPadding(), duration: 700 });
	}
}

function showList() {
	setSelected(null);
	panel.classList.remove("showing-detail");
}

// --- Controls ---

const opacity = document.getElementById("opacity");
function setOpacity() {
	if (map.getLayer("sanborn")) map.setPaintProperty("sanborn", "raster-opacity", opacity.value / 100);
}
opacity.addEventListener("input", setOpacity);
map.once("style.load", setOpacity);

document.getElementById("back-button").addEventListener("click", showList);

document.getElementById("panel-header").addEventListener("click", () => {
	if (isMobile() && !panel.classList.contains("showing-detail")) panel.classList.toggle("peek");
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && selected) showList();
});

// --- Load ---

// Markers are DOM elements, so the census data doesn't wait for the map's "load" event
// (which waits for every basemap tile).
(async () => {
	const data = await (await fetch(CENSUS_URL)).json();
	houses = data.features;
	document.getElementById("sheets-done").textContent = data.sheets_transcribed >= TOTAL_SHEETS
		? `All ${TOTAL_SHEETS} census pages are transcribed.`
		: `${data.sheets_transcribed} of ${TOTAL_SHEETS} census pages are transcribed so far.`;

	buildMarkers();
	renderFilter();
	renderList();

	// Fit to the houses, unless the page was opened with a map view in the URL.
	const placed = houses.filter((f) => f.geometry);
	if (!hadHashOnLoad && placed.length) {
		const b = new maplibregl.LngLatBounds();
		placed.forEach((f) => b.extend(f.geometry.coordinates));
		map.fitBounds(b, { padding: mapPadding(), maxZoom: 18, duration: 0 });
	}
})();
