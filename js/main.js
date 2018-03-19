$.ajax({
  url: "http://data.phl.opendata.arcgis.com/datasets/8bc0786524a4486bb3cf0f9862ad0fbf_0.geojson",
  method: "GET",
  success: function(data) {
    console.log(data);
  }
});













/* =====================
  Global Variables
===================== */


/* =====================
Leaflet Configuration
===================== */
/*
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

*/

/* =====================
## Task 1 : Load Data
===================== */

/*
var dataset = "http://data.phl.opendata.arcgis.com/datasets/8bc0786524a4486bb3cf0f9862ad0fbf_0.geojson";
var featureGroup;

var myStyle = function(feature) {
  return {};
};

var showResults = function() {
  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};

var eachFeatureFunction = function(layer) {
  layer.on('click', function(event) {
    console.log(layer.feature);
    showResults();
  });
};

var myFilter = function(feature) {
  return true;
};

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parseData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    featureGroup.eachLayer(eachFeatureFunction);
  });
});
/* =====================
## Task 2 :
===================== */
