
var map = new L.Map('map').setView([39,-84], 4);

var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

map.addLayer(Esri_WorldGrayCanvas);

// Here's the Tabletop feed
// First we'll initialize Tabletop with our spreadsheet
var jqueryNoConflict = jQuery;

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

pointToLayer: 



function onEachFeature(feature, layer) {
	var popup = "<div class=popup_box" + "id=" + feature.id + ">";
	popup += "<div class='popup_box_header'><strong>" + feature.properties.Artist + "</strong></div>";
	popup += "<hr />";
	popup += "<strong>Number of Times Played:</strong> " + feature.properties.NumberOfTimesPlayed + "<br />";
	popup += "<strong>Songs:</strong><br />";
	var allSongs = feature.properties.SongNames.split('|');
	allSongs.sort();
	var allSongsLength = allSongs.length;
	
	for (var i = 0; i < allSongsLength; i++) {
	popup += allSongs[i] + "<br />";
	}
	
	popup += "</div>";
	layer.bindPopup(popup)
}

function scaledRadius(value) {
	var scaledRadius = 0
	if (5 >= value)
	{
	scaledRadius = 4;
	}
	else if (10 >= value && value >= 6)
	{
	scaledRadius = 6
	}
	else if (20 >= value && value >= 11)
	{
	scaledRadius = 8;
	}
	else if (30 >= value && value >= 21)
	{
	scaledRadius = 10
	}
	else if (100 >= value && value >= 31)
	{
	scaledRadius = 18
	}
	return scaledRadius
}

var geojsonLayer = new L.GeoJSON.AJAX("./HTT.json", {
    onEachFeature: onEachFeature,
	pointToLayer: function (feature, latlng) {
				  return L.circleMarker(latlng, { 

					radius: scaledRadius(feature.properties.NumberOfTimesPlayed),
					fillColor: "#ff7800",
					color: "#000",
					weight: 1,
					opacity: 1,
					fillOpacity: 0.8
				});
}
});

map.addLayer(geojsonLayer);

// Toggle for 'About this map' and X buttons
// Only visible on mobile
isVisibleDescription = false;
// Grab header, then content of sidebar
sidebarHeader = $('.sidebar_header').html();
sidebarContent = $('.sidebar_content').html();
// Then grab credit information
creditsContent = $('.leaflet-control-attribution').html();
$('.toggle_description').click(function() {
	if (isVisibleDescription === false) {
		$('.description_box_cover').show();
		// Add Sidebar header into our description box
		// And 'Scroll to read more...' text on wide mobile screen
		$('.description_box_header').html(sidebarHeader + '<div id="scroll_more"><strong>Scroll to read more...</strong></div>');
		// Add the rest of our sidebar content, credit information
		$('.description_box_text').html(sidebarContent + '<br />');
		$('#caption_box').html('Credits: ' + creditsContent);
		$('.description_box').show();
		isVisibleDescription = true;
	} else {
		$('.description_box').hide();
		$('.description_box_cover').hide();
		isVisibleDescription = false;
	}
});
