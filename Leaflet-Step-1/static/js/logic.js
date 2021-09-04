console.log("Is This Thing On?")

// Let's make a map
var basemap = L.tileLayer(
	"https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
	{
	  attribution:
	    "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
	  tileSize: 512,
	  maxZoom: 18,
	  zoomOffset: -1,
	  id: "mapbox/light-v10",
	  accessToken: API_KEY
	}
      );

var map = L.map("map", {
	center: [
	  40.7, -94.5
	],
	zoom: 3
      })

// put the map on the map
basemap.addTo(map);

// I tried to make a joke about Jason and Ajax but they don't seem to have crossed in mythology
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

//STYLE!
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]), // from the depths of my heart
      color: "#000000",
      radius: getRadius(feature.properties.mag), // magnitude or attitude
      stroke: true,
      weight: 0.5
    };
  };

//COLOR!!
function getColor(depth) {
	switch (true) {
	case depth > 90:
	  return "#ea2c2c";
	case depth > 70:
	  return "#ea822c";
	case depth > 50:
	  return "#ee9c00";
	case depth > 30:
	  return "#eecc00";
	case depth > 10:
	  return "#d4ee00";
	default:
	  return "#98ee00";
	}
      };  

//SIZE!!!
function getRadius(magnitude) {
	if (magnitude === 0) {
	  return 1;
	}
    	return magnitude * 4;
	}	
	
// Your maps should always wear layers
  L.geoJson(data, {
	// making my point(s)
	pointToLayer: function(feature, latlng) {
	  return L.circleMarker(latlng);
	},
	// MOAR STYLE!
	style: styleInfo,
	// True or False:  PopUp>PopTart
	onEachFeature: function(feature, layer) {
	  layer.bindPopup(
	    "Magnitude: "
	      + feature.properties.mag
	      + "<br>Depth: "
	      + feature.geometry.coordinates[2]
	      + "<br>Location: "
	      + feature.properties.place
	  );
	}
      }).addTo(map);
    
      // Legend of Map sounds like a lame Zelda knockoff
      var legend = L.control({
	position: "bottomright"
      });
    
      // Legendary Data
      legend.onAdd = function() {
	var div = L.DomUtil.create("div", "info legend");
    
	// YET MORE STYLE (make it purdy!)
	var buckets = [-10, 10, 30, 50, 70, 90];
	//Oops, they need to be reversed from above!
	var shade = [
	  "#98ee00",
	  "#d4ee00",
	  "#eecc00",
	  "#ee9c00",
	  "#ea822c",
	  "#ea2c2c"
	];
    
	// Looping through our intervals to generate a label with a colored square for each interval.
	//WHY ISN"T THIS WORKING!?!?!?!?!
	for (var i = 0; i < buckets.length; i++) {
	  div.innerHTML += "<i style='background: " + shade[i] + "'></i> "
	  + buckets[i] + (buckets[i + 1] ? "&mdash;" + buckets[i + 1] + "<br>" : "+");
	}
	return div;
      };
    
      // Put that legend on the map!
      //legend.addTo(map);

//end of the very long function because I keep losing the stupid thing
});