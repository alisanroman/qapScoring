/* =====================
  Helper functions
===================== */
var defaultMapView = function(){
  map.setView([40, -75.1090], 11);
};

var clearMap = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};

var polyPopUp = function(feature) {
  thePopup = L.popup({className: 'poly-popup'})
  .setContent(
    feature.properties.mapname + // want to have the nhood name
    "<br><em class='popup-body'>Poverty rate: </em>" +
    feature.properties.povPct + "%" // need poverty rate for each census tract
  );
  return(thePopup);
};

var subsidizedPopUp = function(feature) {
  thePopup = L.popup({className: 'popup'})
  .setContent(
    feature.properties["Property.Name"] +
    "<br><em class='popup-body'> Total Units: </em>"
  );
  return(thePopup);
};


/* =====================
  Basemap
===================== */
var map = L.map('map',{
  zoomControl: false
});

var zoom = L.control.zoom({position: 'topright'}).addTo(map);
defaultMapView();

var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png'
}).addTo(map);

/* ======================
    Slide functions
========================= */

var slide1Func = function(e) {
  // Reset Map
  clearMap();
  defaultMapView();

  // First show poverty rates chloropleth
  povertyArray = _.map(parsedData.features,
  function(tract) {
    return tract.properties.povPct;
  });

  theLimits = chroma.limits(povertyArray,'q',5);

  // Define color scheme
  colorPolygons = function(feature) {
    if(feature.properties.povPct === "NA") {
      return "#FFFFFF";
    } else if(feature.properties.povPct < theLimits[1]) {
      return colorRamp[4];
    } else if(feature.properties.povPct < theLimits[2]) {
      return colorRamp[3];
    } else if(feature.properties.povPct < theLimits[3]) {
      return colorRamp[2];
    } else if(feature.properties.povPct < theLimits[4]) {
      return colorRamp[1];
    } else {
      return colorRamp[0];
    }
  };

  // want to get a legend in here

  myStyle = function(feature) {
    var theStyle = {
      color: colorPolygons(feature),
      fillOpacity: 0.75,
      stroke: true,
      strokeOpacity: 1,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(parsedData, {
    style: myStyle,

    onEachFeature: function(feature,layer) {
      layer.bindPopup(polyPopUp(feature));
    }
  });
  map.addLayer(featureGroup);
};

var slide2Func = function() {

  // First show poverty rates chloropleth, zooming in on Society Hill
  slide1Func();
  map.setView([39.95,-75.14], 15);

  subsidizedHousingArray = _.map(pointParsedData)

};

/*

  pricesArray = _.map(parsedData.features,
     function(college){
       return college.properties.Median_HHIncome;
   });

   theLimits = chroma.limits(pricesArray, 'q', 5);

   myStyle = function(feature){
     if (feature.properties.Median_HHIncome < theLimits[1]) {
       return {fillColor: colorRamp[0], stroke: false};
     } else if (feature.properties.Median_HHIncome < theLimits[2]) {
       return {fillColor: colorRamp[1], stroke: false};
     } else if (feature.properties.Median_HHIncome < theLimits[3]) {
       return {fillColor: colorRamp[2], stroke: false};
     } else if (feature.properties.Median_HHIncome < theLimits[4]) {
       return {fillColor: colorRamp[3], stroke: false};
     } else {
       return {fillColor: colorRamp[4], stroke: false};
     }
   };

   featureGroup = L.geoJson(parsedData, {
     style: myStyle,

     pointToLayer: function(feature, latlng) {
         return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
     },

     onEachFeature: function (feature, layer) {
         layer.bindPopup(pointPopup(feature));
     }
   });
   map.addLayer(featureGroup);
*/


var slide3Func = function() {
  //code here
};

var slide4Func = function() {
  //code here
};

var slide5Func = function() {
  //code here
};

/* =====================
State object
===================== */
var state = {
  "slideNumber": 0,
  "slideData": [
    {
      "title": "Where are there low poverty rates?",
      "text": slide1text
    },
    {
      "title": "Where are there limited affordable housing options?",
      "text": slide2text
    },
    {
      "title": "Where is there limited affordable housing production in the past 20 years?",
      "text": slide3text
    },
    {
      "title": "Where are the high owner-occupied markets?",
      "text": slide4text
    },
    {
      "title": "Where are there high performing schools?",
      "text": slide5text
    }
  ]
};

/* =====================
  Data
===================== */
var polyData = "https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/polyData.geojson";
var pointData = "";

var colorRamp = ["#F03400","#F26711","#D9A60F","#758540","#384216"];

/* =====================
  Functionality
===================== */
var parsedData;
var pointParsedData;
var featureGroup;
var theLimits;
var myStyle = {};

$.ajax(pointData).done(function(pointData) {
  // Parse JSON
  pointParsedData = JSON.parse(pointData);
  featureGroup = L.geoJson(parsedData, {
    style: {
      fillColor: colorRamp[4],
      stroke: false
      },
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
    },
  });
  map.addLayer(featureGroup);
};


$.ajax(polyData).done(function(polyData) {
  parsedData = JSON.parse(polyData);
  featureGroup = L.geoJson(parsedData, {
    style: {
      fillColor: colorRamp[4],
      stroke:false
    },
  });
  map.addLayer(featureGroup);

  // Click Functionality
  var clickNextButton = function(e) {
    if(state.slideNumber < state.slideData.length) {
      state.slideNumber +=1;
    } else {
      state.slideNumber = 1;
    }
    $(".Slide-title").html(state.slideData[state.slideNumber -1].title);
    $(".Slide-text").html(state.slideData[state.slideNumber-1].text);
    showTheSlide(state.slideNumber);
  };

  var clickPreviousButton = function(e) {
    if(state.slideNumber > 1) {
      state.slideNumber -=1;
    } else {
      state.slideNumber = state.slideData.length;
    }
    $(".Slide-title").html(state.slideData[state.slideNumber -1].title);
    $(".Slide-text").html(state.slideData[state.slideNumber-1].text);
    showTheSlide(state.slideNumber);
  };

  //  Function to call the appropriate slide function
  var showTheSlide = function(slideNumber) {
    switch(slideNumber) {
      case 1:
        slide1Func();
        break;
      case 2:
        slide2Func();
        break;
      case 3:
        slide3Func();
        break;
      case 4:
        slide4Func();
        break;
      case 5:
        slide5Func();
        break;
      default:
        break;
      }
  };
  //  On clicks call the clickbutton functions, calling the showslide function
  $('#next').click(function() {
    clickNextButton();
  });
  $('#previous').click(function() {
    clickPreviousButton();
  });
});
