/* =====================
  Helper functions
===================== */
var defaultMapView = function(){
  map.setView([40, -75.1090], 11);
};

var clearMap = function() {
  map.eachLayer(function (layer) {
    map.removeLayer(layer);
  });
};

var polyPopUp = function(feature) {
  thePopup = L.popup({className: 'poly-popup'})
  .setContent(
    feature.properties.mapname + // want to have the nhood name
    "<br><em class='popup-body'>Poverty Rate: </em>" +
    feature.properties.povPct + "%" // need poverty rate for each census tract
  );
  return(thePopup);
};

var polyPopUp2 = function(feature) {
  thePopup = L.popup({className: 'poly-popup'})
  .setContent(
    feature.properties.mapname + // want to have the nhood name
    "<br><em class='popup-body'>Homeownership Rate: </em>" +
    feature.properties.homPct + "%" // need poverty rate for each census tract
  );
  return(thePopup);
};

var polyPopUp3 = function(feature) {
  thePopup = L.popup({className: 'poly-popup'})
  .setContent(
    feature.properties.mapname + //neighborhood
    "<br>" +
    feature.properties.categ + //category
    "<br><em class = 'popup-body'>Poverty Rate: </em>" +
    feature.properties.povPct + "%" +
    "<br><em class='popup-body'>Homeownership Rate: </em>" +
    feature.properties.homPct + "%"
  );
  return(thePopup);
};

var pointPopUp = function(feature) {
  thePopup = L.popup({className: 'popup'})
  .setContent(
    feature.properties.propName +
    "<br><em class='popup-body'> Total Units: </em>" +
    feature.properties.totalUnits +
    "<br><em class='popup-body'> Year Built: </em>" +
    feature.properties.yrBuilt
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

/////////////////////////////////////////
//// Slide 1: Poverty rates          ////
/////////////////////////////////////////
var slide1Func = function(e) {
  // Reset Map
  clearMap();
  Stamen_TonerLite.addTo(map);
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
      fillOpacity: 0.45,
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

/////////////////////////////////////////
//// Slide 2: Add affordable housing ////
/////////////////////////////////////////
var slide2Func = function() {
  // Reset map
  clearMap();
  Stamen_TonerLite.addTo(map);
  map.setView([39.964,-75.148], 15);

  myStyle = function(feature) {
    return {
      stroke: true,
      strokeOpacity: 0.75,
      fillOpacity: 0.5,
      color: colorRamp[4],
      radius: feature.properties.totalUnits * 0.2,
      weight: 1
    };
  };

  featureGroup = L.geoJson(pointParsedData, {
     style: myStyle,
     pointToLayer: function(feature, latlng) {
         return new L.CircleMarker(latlng, {fillOpacity: 0.65});
     },
     onEachFeature: function (feature, layer) {
         layer.bindPopup(pointPopUp(feature));
     }
   }).addTo(map);
};

/////////////////////////////////////////
//// Slide 3: Filter by yr built     ////
/////////////////////////////////////////
var slide3Func = function() {
  // Reset map
  clearMap();
  Stamen_TonerLite.addTo(map);
  map.setView([39.964,-75.148], 15);

  // Define color scheme
  colorCircles = function(feature) {
    if(feature.properties.yrBuilt === null ) {
      return "#CCCCCC";
    } else if(feature.properties.yrBuilt < 1960) {
      return colorRamp[0];
    } else if(feature.properties.yrBuilt < 1970) {
      return colorRamp[1];
    } else if(feature.properties.yrBuilt < 1980) {
      return colorRamp[2];
    } else if(feature.properties.yrBuilt < 1990) {
      return colorRamp[3];
    } else { return colorRamp[4]; }
  };

  myStyle = function(feature) {
    var theStyle = {
      stroke: true,
      strokeOpacity: 0.75,
      fillOpacity: 0.5,
      color: colorCircles(feature),
      radius: feature.properties.totalUnits * 0.2,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(pointParsedData, {
    style: myStyle,
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {fillOpacity: 0.65});
    },
    onEachFeature: function (feature, layer) {
        layer.bindPopup(pointPopUp(feature));
    }
  }).addTo(map);

};

/////////////////////////////////////////
//// Slide 4: Homeownership rates    ////
/////////////////////////////////////////
var slide4Func = function() {
  clearMap();
  Stamen_TonerLite.addTo(map);
  defaultMapView();

  // Show home ownership chloropleth
  homeOwnership = _.map(parsedData.features,
  function(tract) {
    return tract.properties.homPct;
  });

  theLimits = chroma.limits(homeOwnership,'q',5);

  // Define color scheme
  colorPolygons = function(feature) {
    if(feature.properties.homPct === "NA") {
      return "#FFFFFF";
    } else if(feature.properties.homPct < theLimits[1]) {
      return colorRamp[0];
    } else if(feature.properties.homPct < theLimits[2]) {
      return colorRamp[1];
    } else if(feature.properties.homPct < theLimits[3]) {
      return colorRamp[2];
    } else if(feature.properties.homPct < theLimits[4]) {
      return colorRamp[3];
    } else {
      return colorRamp[4];
    }
  };

  // want to get a legend in here

  myStyle = function(feature) {
    var theStyle = {
      color: colorPolygons(feature),
      fillOpacity: 0.45,
      stroke: true,
      strokeOpacity: 1,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(parsedData, {
    style: myStyle,
    onEachFeature: function(feature,layer) {
      layer.bindPopup(polyPopUp2(feature));
    }
  }).addTo(map);
};


/////////////////////////////////////////
//// Slide 5: Putting it together   ////
/////////////////////////////////////////

var slide5Func = function() {
  clearMap();
  Stamen_TonerLite.addTo(map);

  // Show combo chloropleth
  comboPoly = _.map(parsedData.features,
  function(tract) {
    return tract.properties.categ;
  });

  // Define color scheme
  colorPolygons = function(feature) {
    if(feature.properties.categ === "NA") {
      return "#FFFFFF";
    } else if(feature.properties.categ == "Low poverty, high homeownership") {
      return colorRamp[4];
    } else if(feature.properties.categ == "Low poverty, low homeownership") {
      return colorRamp[3];
    } else if(feature.properties.categ == "High poverty, high homeownership") {
      return colorRamp[1];
    } else if(feature.properties.categ == "High poverty, low homeownership") {
      return colorRamp[0];
    } else {
      return colorRamp[2];
    }
  };

  // want to get a legend in here

  myStyle = function(feature) {
    var theStyle = {
      color: colorPolygons(feature),
      fillOpacity: 0.45,
      stroke: true,
      strokeOpacity: 1,
      weight: 1
    };
    return(theStyle);
  };

  featureGroup = L.geoJson(parsedData, {
    style: myStyle,
    onEachFeature: function(feature,layer) {
      layer.bindPopup(polyPopUp3(feature));
    }
  }).addTo(map);

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
      "title": "Where has there been limited affordable housing production in the past 20 years?",
      "text": slide3text
    },
    {
      "title": "Where are the high owner-occupied markets?",
      "text": slide4text
    },
    {
      "title": "Putting it all together.",
      "text": slide5text
    }
  ]
};

/* =====================
  Data
===================== */
var polyData = "https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/polyData.geojson";
var pointData = "https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/pointData.geojson";

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
  featureGroup = L.geoJson(pointParsedData, {
    style: {
      fillColor: colorRamp[4],
      stroke: false
      },
    pointToLayer: function(feature, latlng) {
      return new L.CircleMarker(latlng, {radius: 3, fillOpacity: 0.85});
    },
  });
  map.addLayer(featureGroup);
});


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
