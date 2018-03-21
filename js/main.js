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
    feature.properties.neighborhood + // want to have the nhood name
    "<br><em class='popup-body'>Poverty rate: </em>" +
    feature.properties.pctPoverty + "%" // need poverty rate for each census tract
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
    return tract.properties.pctPoverty;
  });

  theLimits = chroma.limits(povertyArray,'q',5);

  // Define color scheme
  colorPolygons = function(feature) {
    if(feature.properties.pctPoverty < theLimits[1]) {
      return colorRamp[0];
    } else if(feature.properties.pctPoverty < theLimits[2]) {
      return colorRamp[1];
    } else if(feature.properties.pctPoverty < theLimits[3]) {
      return colorRamp[2];
    } else if(feature.properties.pctPoverty < theLimits[4]) {
      return colorRamp[3];
    } else {
      return colorRamp[4];
    }
  };

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
  // code here
};

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
var nhoodURL = "https://raw.githubusercontent.com/alisanroman/philly-hoods/master/data/Neighborhoods_Philadelphia.geojson";
var nhoodParse = $.ajax(nhoodURL);
var nhoodParse1 = JSON.parse(nhoodParse.responseText);

var tractsURL = "https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/Census_Tracts_2010.geojson";


var colorRamp = ["#C07CBE","#DFBCDD","#FEFDFC","#FCD47F","#FBAC02"];

/* =====================
  Functionality
===================== */
var parsedData;
var featureGroup;
var theLimits;
var myStyle = {};

$.ajax(dataset).done(function(dataset) {
  parsedData = JSON.parse(dataset);
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
