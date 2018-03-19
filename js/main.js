/* =====================
  Global Variables
===================== */


/* =====================
Leaflet Configuration
===================== */

var map = L.map('map', {
  center: [40.000, -75.1090],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);


/* =====================
## Task 1 : Load Data
===================== */

var getData = $.ajax()

var datasource =

//then load geojson layer
L.geoJson(datasource, {
    onEachFeature: popup, // onEachFeature is built in
    style:countryStyle
}).addTo(map);

/* =====================
## Task 2 :
===================== */
