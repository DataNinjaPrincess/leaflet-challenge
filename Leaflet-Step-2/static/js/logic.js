console.log("Is This Thing STILL On?");

// old: Let's make a map
var basemap = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY,
  }
);

// New: More Maps!
var satnav = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/outdoors-v11",
  accessToken: API_KEY
});

// old
var map = L.map("map", {
  center: [40.7, -94.5],
  zoom: 3,
  // but this is new!
  layers: [basemap, satnav, outdoors]
});

// old: put the map on the map
satnav.addTo(map);

// New: layering the cake
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();

// New: which map do you want?
var baseMaps = {
  Satellite: satnav,
  Grayscale: basemap,
  Outdoors: outdoors
};

// New: select your options
var overlays = {
	"Tectonic Plates": tectonicplates,
	Earthquakes: earthquakes
      };
          
 L
	.control
	.layers(baseMaps, overlays)
	.addTo(map)

// old
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(function (data) {
  //STYLE!
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]), // from the depths of my heart
      color: "#000000",
      radius: getRadius(feature.properties.mag), // magnitude or attitude
      stroke: true,
      weight: 0.5,
    };
  }

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
  }

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
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng);
    },
    // MOAR STYLE!
    style: styleInfo,
    // True or False:  PopUp>PopTart
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "Magnitude: " +
          feature.properties.mag +
          "<br>Depth: " +
          feature.geometry.coordinates[2] +
          "<br>Location: " +
          feature.properties.place
      );
    },
// New: added to earthquakes instead of the map so it can be toggled on and off
  }).addTo(earthquakes);

// New: so it doesn't initiate as a sad blank map
  earthquakes.addTo(map);

// old: because the legend continues
  var legend = L.control({
	classed: ("legend"),
    position: "bottomright",
  });

  // Legendary Data
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    // Match the numbers with the colors
    var bucket = [-10, 10, 30, 50, 70, 90];
    //Oops, they need to be reversed from above!
    var shade = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c",
    ];

    // Looping through to make labels
    // It apparently helps to add style to your style sheet if you want your sheet to have style
    for (var i = 0; i < bucket.length; i++) {
	div.innerHTML += "<i style='background: " + shade[i] + "'></i> "
	+bucket[i] + (bucket[i + 1] ? "&ndash;" + bucket[i + 1] + "<br>" : "+");
    }
    return div;
  };

  // Put that legend on the map!
  legend.addTo(map);

// New: It's not your Fault, lines!
// More Ajax.  I mean Francis
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(platedata) {
	
	L.geoJson(platedata, {
	  color: "deeppink",
	  weight: 2
	})
	.addTo(tectonicplates);
  
	// Then add the tectonicplates layer to the map.
	tectonicplates.addTo(map);
      });
  //end of the very long function because I keep losing the stupid thing
});
