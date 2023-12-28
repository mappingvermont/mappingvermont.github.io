function buildLeafletMap() {

    var map = L.map('map', {
        center: new L.LatLng(43.152, -72.559),
        zoom: 16
    });

    var bing = new L.BingLayer("AjMKOLJsPsYaPF54X8dtvnhmDEz7HqgjJ9tPox6S3MqgEs395sUYJbaOBLVX5WJh");
    map.addLayer(bing);

    map.createPane('cambridgeport');
    map.getPane('cambridgeport').style.zIndex = 650;

    var cambridgeport = new L.tileLayer(
        'https://mapping-vt-tiles.s3.amazonaws.com/cambridgeport-1869/{z}/{x}/{y}.png', {
            maxZoom: 20,
            opacity: 0.7,
            pane: 'cambridgeport',
            attribution: '<a href="https://Old-Maps.com" target="_blank">Old-Maps.com</a>',
        }).addTo(map)

    map.createPane('vcgi');
    map.getPane('vcgi').style.zIndex = 450;

    var vcgi_lidar = L.esri.imageMapLayer({
        url: 'https://maps.vcgi.vermont.gov/arcgis/rest/services/EGC_services/IMG_VCGI_LIDARHILLSHD_WM_CACHE_v1/ImageServer',
        attribution: '<a href="https://vcgi.vermont.gov/" target="_blank">VCGI</a>',
        pane: 'vcgi',
        opacity: 0.7
    }).addTo(map)

    var hash = new L.Hash(map);

    /* Set DRA if we want to use actually elevation data instead of hillshade
    var rasterFuncProperties = {
        "rasterFunction": "Stretch",
        "rasterFunctionArguments": {
            "StretchType": 5,
            "DRA": true
        },
        "variableName": "Raster",
        "outputPixelType": "float"
    }
    vcgi_lidar.setRenderingRule(rasterFuncProperties)
    */

    $(function() {
        $("#slider").slider({
            range: "max",
            min: 0,
            max: 10,
            value: 7,

            slide: function(event, ui) {
                cambridgeport.setOpacity(ui.value * 0.1);
            }
        });
    });



    $(function() {
        $("#slider2").slider({
            range: "max",
            min: 0,
            max: 10,
            value: 7,

            slide: function(event, ui) {
                vcgi_lidar.setOpacity(ui.value * 0.1);
            }
        });
    });


};


$(document).ready(function() {
    buildLeafletMap();
});

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
