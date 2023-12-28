var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

var map = new L.Map('map', {
    center: new L.LatLng(39, -84),
    zoom: 4,
    layers: [Esri_WorldGrayCanvas]
});

var currentYear = {}
var lastYear = {}
var isPaused = false

//Add the first layer automatically when we load the map
addLayerByYear(2013);

function addLayerByYear(yearVal) {

    //Save the current markers as last year as we build a new "currentYear" list
    lastYear = currentYear
    currentYear = {}
    markerList = []

    for (i in addresses) {

        //if this person has a location for the year in question . . . 
        if (addresses[i][yearVal]) {

            //if the person also has an address for the previous year
            if (lastYear[i]) {

                //If the previous year's lat value is different than this year's
                if ((addresses[i][yearVal][0] != lastYear[i][0])) {

                    //create a moving marker from last year to this year
                    var movingMarker = L.Marker.movingMarker(
                        [
                            lastYear[i],
                            addresses[i][yearVal]
                        ], [5000], {
                            autostart: true
                        }
                    ).bindPopup(addresses[i]['popupText']);
                    markerList.push(movingMarker);

                //if the person existed last year, but the address didn't change
                //add a regular marker
                } else {

                    markerList.push(L.marker(
                        addresses[i][yearVal]
                    ).bindPopup(addresses[i]['popupText']));
                }

            //if the person didn't have a marker last year, add a regular marker
            } else {

                markerList.push(L.marker(
                    addresses[i][yearVal]
                ).bindPopup(addresses[i]['popupText']));

            }

            //Add all markers to our list for this current year
            //This will be used later as lastYear to compare
            currentYear[i] = addresses[i][yearVal]

        }

    }

    //Add all markers in the list to the map
    myLayer = L.layerGroup(markerList).addTo(map);
}

//Listen for slider events and add/remove layers
function sliderControl(yearVal) {

    map.removeLayer(myLayer);

    addLayerByYear(yearVal);
}

//Listen for pause events and pause/start moving markers
function pauseButton() {

    //For all markers in myLayer
    for (i in myLayer._layers) {

        //If it has a _currentDuration value (i.e. is a moving marker)
        if (myLayer._layers[i]._currentDuration) {

            //if it's running, stop it
            if (myLayer._layers[i].isRunning()) {
                myLayer._layers[i].pause()

            //if it's not running, start it
            } else {
                myLayer._layers[i].start()
            }

        }

    }

}