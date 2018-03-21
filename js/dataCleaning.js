var cleanNhoods = function(e) {
  var nhoodsURL = "https://raw.githubusercontent.com/alisanroman/philly-hoods/master/data/Neighborhoods_Philadelphia.geojson";
  var nhoods0 = $.ajax(nhoodsURL);
  var nhoods1 = nhoods0.responseText;
  console.log(nhoods1);
};
cleanNhoods();

var neighborhoods = $.ajax("https://raw.githubusercontent.com/alisanroman/philly-hoods/master/data/Neighborhoods_Philadelphia.geojson");


var nhoods0 = neighborhoods.responseText;
var nhoods1 = JSON.parse(nhoods0);

var tractsURL = "https://raw.githubusercontent.com/alisanroman/qapScoring/master/data/Census_Tracts_2010.geojson";



var povertyData = $.ajax("https://api.census.gov/data/2016/acs/acs5?get=B17001_001E,B17001_002E&for=tract:*&in=state:42&in=county:101&key=4d92e5c53d5b7046bae0b72874aceed0fde3e0b4");
