var current_location = [25.0202, 121.553]
var lat = current_location[0];
var lng = current_location[1];
var map = L.map('mapid',{doubleClickZoom : false}).setView(current_location, 10);
var myLayerGroup = L.layerGroup().addTo(map);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,minZoom: 1,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery c <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);
map.setView(current_location,8)



lngE = map.getBounds().getEast();
lngW = map.getBounds().getWest();
latN = map.getBounds().getNorth();
latS = map.getBounds().getSouth();


function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(function(position) {
            current_location[0] = position.coords.latitude
            current_location[1] = position.coords.longitude
        });
        ;
    } else {
        alert("Geolocation is not supported by this browser.");
        console.log('not supported')
    }
}

function normalize_lng(lng){
    return lng;
}

map.on('click',function(e){
    latlng = e.latlng
    current_location = [latlng['lat'], latlng['lng']]
    // console.log(latlng)
    myLayerGroup.clearLayers();
    marker = L.marker(latlng)
    marker.addTo(myLayerGroup)
    document.getElementById('input-lat').value=latlng['lat'].toFixed(4)
    document.getElementById('input-lng').value=normalize_lng(latlng['lng']).toFixed(4)
     
});





