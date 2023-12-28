
// Pull data from Google spreadsheet
// And push to our startUpLeaflet function
function initializeTabletopObject() {

    tabletopData = []

    divNode = "";

    var accessToken = 'pk.eyJ1IjoibWFwcGluZ3Zlcm1vbnQiLCJhIjoiY2xxcGxsY3VmMjNhYTJpbmd0ZGlxeXhzbyJ9.mH7c6GvzULarrmFGDrZ-zw'
    var mapboxSatellite = new L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
  attribution: '<a href="https://www.mapbox.com/imagery" target="_blank">Mapbox</a>',
      minZoom: 8,
      maxZoom: 21,
    })

    var BFSanborn = new L.tileLayer('http://mapping-vt-tiles.s3.amazonaws.com/sanborn/{z}/{x}/{y}.png', {
  attribution: '<a href="http://www.loc.gov/rr/geogmap/sanborn/city.php?CITY=Montpelier&stateID=52" target="_blank">Library of Congress</a>',
      minZoom: 8,
      maxZoom: 21,
      opacity: 0.7,
    })

    var map = new L.Map('map', {
        center: new L.LatLng(44.044167, -71.993408),
        zoom: 8,
        minZoom: 7,
        maxZoom: 21,
        layers: [mapboxSatellite, BFSanborn]
     });

        // include marker clustering
        var markers = L.markerClusterGroup({disableClusteringAtZoom: 15});

        $.getJSON("sanborn.json", function(srcJSON) {
          for (var num = 0; num < srcJSON.length; num++) {
              // Our table columns
              var name = srcJSON[num].name;
              var imageLink = srcJSON[num].imagelink;
              console.log(imageLink);
              var imageDescription = srcJSON[num].imagedescripton;

              // Pull in our lat, long information
              var dataLat = srcJSON[num].latitude;
              var dataLong = srcJSON[num].longitude;

              // Add to our marker
              marker_location = new L.latLng(dataLat, dataLong);

              // Create the marker
              layer = new L.Marker(marker_location);

              // Create the popup
              var divNode = document.createElement('DIV' + num);
              var popup = "<div class='popup_box_header'><strong>" + name + "</strong></div>";
              popup += "<hr />";
              popup += "<img style='height:auto; width:auto; max-width:500px; max-height:500px;' src=" + imageLink + ">";
              popup += "<hr />" + imageDescription;

              // Add to our marker

              divNode.innerHTML = popup
              layer.bindPopup(divNode, {
                  maxWidth: 800,
                  autoPan: true
              });

              // Add marker to our to map
              // map.addLayer(layer)
              markers.addLayer(layer)
          }
          map.addLayer(markers);
        });

        // initialize leaflet-hash
        var hash = new L.Hash(map);


    $(function() {
        $("#slider").slider({
            range: "max",
            min: 0,
            max: 10,
            value: 7,

            slide: function(event, ui) {
                BFSanborn.setOpacity(ui.value * 0.1);
                // alert( ui.value );
            }
        });
    });

};

$(document).ready(function() {
    initializeTabletopObject();
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
