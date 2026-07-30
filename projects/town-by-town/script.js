import * as pmtiles from "https://esm.sh/pmtiles@4.4.1";

const PMTILES_URL = "https://mapping-vt-tiles.s3.amazonaws.com/vermont.pmtiles";
const VERMONT_BOUNDS = [-73.9, 42.5, -71.2, 45.3];

const protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles", protocol.tile);

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
				attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
			}
		},
		layers: basemaps.layers("protomaps", basemaps.namedFlavor("light"), { lang: "en" })
	},
	bounds: VERMONT_BOUNDS,
	fitBoundsOptions: { padding: 20 }
});

map.addControl(new maplibregl.NavigationControl(), "top-right");

let episodes = [];
let townsGeoJSON = null;
let selectedTown = null;

function townBounds(feature) {
	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
	const visit = (coords) => {
		if (typeof coords[0] === "number") {
			const [x, y] = coords;
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;
		} else {
			coords.forEach(visit);
		}
	};
	visit(feature.geometry.coordinates);
	return [[minX, minY], [maxX, maxY]];
}

function formatDate(dateStr) {
	const [year, month, day] = dateStr.split("-").map(Number);
	const d = new Date(year, month - 1, day);
	return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function renderEpisodeList() {
	const list = document.getElementById("episode-list");
	list.innerHTML = "";
	const sorted = [...episodes].sort((a, b) => b.date.localeCompare(a.date));
	sorted.forEach((ep) => {
		const row = document.createElement("div");
		row.className = "episode-row";
		row.dataset.town = ep.town;
		row.innerHTML = `
			<div class="town-name">${ep.town}</div>
			<div class="episode-date">${formatDate(ep.date)}</div>
		`;
		row.addEventListener("click", () => selectEpisode(ep));
		list.appendChild(row);
	});
}

function selectEpisode(ep) {
	const feature = townsGeoJSON.features.find((f) => f.properties.TOWNNAME === ep.town);
	if (!feature) return;

	if (selectedTown) {
		map.setFeatureState({ source: "towns", id: selectedTown }, { selected: false });
	}
	map.setFeatureState({ source: "towns", id: ep.town }, { selected: true });
	selectedTown = ep.town;

	map.fitBounds(townBounds(feature), { padding: 60, duration: 800 });

	document.querySelectorAll(".episode-row").forEach((row) => {
		row.classList.toggle("active", row.dataset.town === ep.town);
	});

	document.getElementById("detail-town").textContent = ep.town;
	document.getElementById("detail-date").textContent = formatDate(ep.date);
	document.getElementById("detail-summary").textContent = ep.summary;
	document.getElementById("detail-link").href = ep.url;

	const panel = document.getElementById("panel");
	panel.classList.add("showing-detail");
	panel.classList.remove("peek");
}

function showList() {
	const panel = document.getElementById("panel");
	panel.classList.remove("showing-detail");
}

document.getElementById("back-button").addEventListener("click", showList);

// Mobile: tap the header/handle to collapse/expand the sheet when browsing the list.
document.getElementById("panel-header").addEventListener("click", () => {
	const panel = document.getElementById("panel");
	if (panel.classList.contains("showing-detail")) return;
	panel.classList.toggle("peek");
});

map.on("load", async () => {
	const [episodesRes, townsRes] = await Promise.all([
		fetch("data/episodes.json"),
		fetch("data/towns_simplified.geojson")
	]);
	episodes = await episodesRes.json();
	townsGeoJSON = await townsRes.json();

	map.addSource("towns", {
		type: "geojson",
		data: townsGeoJSON,
		promoteId: "TOWNNAME"
	});

	const visitedTowns = episodes.map((ep) => ep.town);

	map.addLayer({
		id: "towns-fill",
		type: "fill",
		source: "towns",
		paint: {
			"fill-color": "#e8a33d",
			"fill-opacity": [
				"case",
				["boolean", ["feature-state", "selected"], false], 0.45,
				["in", ["get", "TOWNNAME"], ["literal", visitedTowns]], 0.18,
				0
			]
		}
	});

	map.addLayer({
		id: "towns-line",
		type: "line",
		source: "towns",
		paint: {
			"line-color": "#b5590f",
			"line-width": [
				"case",
				["boolean", ["feature-state", "selected"], false], 2.5,
				["in", ["get", "TOWNNAME"], ["literal", visitedTowns]], 1,
				0
			]
		}
	});

	visitedTowns.forEach((town) => {
		map.setFeatureState({ source: "towns", id: town }, { visited: true });
	});

	renderEpisodeList();

	map.on("click", "towns-fill", (e) => {
		const townName = e.features[0].properties.TOWNNAME;
		const ep = episodes.find((ep) => ep.town === townName);
		if (ep) selectEpisode(ep);
	});

	map.on("mouseenter", "towns-fill", (e) => {
		const townName = e.features[0].properties.TOWNNAME;
		map.getCanvas().style.cursor = visitedTowns.includes(townName) ? "pointer" : "";
	});

	map.on("mouseleave", "towns-fill", () => {
		map.getCanvas().style.cursor = "";
	});
});
