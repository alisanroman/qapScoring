/* =====================
Helper Functions
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

var dataset = "http://data.phl.opendata.arcgis.com/datasets/e9e2e152bc1644e2af84927a8f4c3c06_0.geojson";
var featureGroup;

var myStyle = function(feature) {
  switch (feature.properties.COLLDAY) {
    case 'MON': return {color: 'red'};
    case 'TUE': return {color: 'orange'};
    case 'WED': return {color: 'yellow'};
    case 'THU': return {color: 'green'};
    case 'FRI': return {color: 'purple'};
    case 'SAT': return {color: 'white'};
    case 'SUN': return {color: 'black'};
  }
};


var myFilter = function(feature) {
  switch (feature.properties.COLLDAY) {
    case 'MON': return true;
    case 'TUE': return true;
    case 'WED': return true;
    case 'THU': return true;
    case 'FRI': return true;
    case 'SAT': return true;
    case 'SUN': return true;
  }
};



var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    if (layer.feature.properties.COLLDAY == 'MON') {
      $(".day-of-week").text('Monday');
    } else { if (layer.feature.properties.COLLDAY == 'TUE') {
        $(".day-of-week").text('Tuesday');
      } else { if (layer.feature.properties.COLLDAY == 'WED') {
          $(".day-of-week").text('Wednesday');
        } else { if (layer.feature.properties.COLLDAY == 'THU') {
            $(".day-of-week").text('Thursday');
          } else { if (layer.feature.properties.COLLDAY == 'FRI') {
              $(".day-of-week").text('Friday');
            } else { if (layer.feature.properties.COLLDAY == 'SAT') {
                $(".day-of-week").text('Saturday');
              } else { if (layer.feature.properties.COLLDAY == 'SUN') {
                  $(".day-of-week").text('Sunday');
      }  } } } } } }
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    console.log(layer.feature);
    showResults();
  });
};



var showResults = function() {
  /* =====================
  This function uses some jQuery methods that may be new. $(element).hide()
  will add the CSS "display: none" to the element, effectively removing it
  from the page. $(element).show() removes "display: none" from an element,
  returning it to the page. You don't need to change this part.
  ===================== */
  // => <div id="intro" css="display: none">
  $('#intro').hide();
  // => <div id="results">
  $('#results').show();
};

$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter
    }).addTo(map);

    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
});



legend.addTo(map);

/* =====================
## Task 2 :
===================== */
