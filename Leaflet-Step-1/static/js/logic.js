console.log("Is This Thing On?")

// Let's make a map
var graymap = L.tileLayer(
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