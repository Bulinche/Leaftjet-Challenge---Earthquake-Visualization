// Importing the basemaps from MapBox
var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

var comicmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.comic",
    accessToken: API_KEY
});

var pencilmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pencil",
    accessToken: API_KEY
});

var outdoorsMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// Name the baseMaps
var baseMaps = {
  "Satellite": satelliteMap,
  "Comic map": comicmap, 
  "Pencil Map": pencilmap,
  "Outdoors": outdoorsMap
};

// Define a map object
var map = L.map("map", {
  // USA coordinates
  center: [37.10, -95.71],
  zoom: 3.5,
  layers: [satelliteMap]
});

var layers = {
  earthquakes: new L.LayerGroup(),
  tactonicPlates: new L.LayerGroup()
};

// Create overlays to add Earthquakes and Tactonic Plates
var overlays = {
    "Earthquakes": layers.earthquakes,
    "Tactonic Plates": layers.tactonicPlates
  };
  
    // create a layer control and add it to the maps
  L.control.layers(baseMaps, overlays, {collapsed: false}).addTo(map);
  
  // Getting the data
  var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  d3.json(queryUrl, function (data) {
  var earthquakes = L.geoJSON(data, {
  
      // Making and adding the circles
      pointToLayer: function (feature, latlng) {
        var earthquakeMarker = {
          stroke: false,
          radius: markerSize(feature),
          fillColor: markerColor(feature),
          fillOpacity: 1
        };
        return L.circleMarker(latlng, earthquakeMarker);
      },
  
      // Adding the pop ups 
      onEachFeature: function (feature, layer) {
        return layer.bindPopup("<h3>Place: " + feature.properties.place +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p><hr><p>Time: " + new Date(feature.properties.time) +"</p>");
      }
    }).addTo(layers["earthquakes"]);
  
   
  });

// Add Colors to the circle markers
var color = "";
function markerColor(feature) {
  if (feature.properties.mag <= 1) {
    return color = "#913dff";
  }
  else if (feature.properties.mag <= 2) {
    return color = "#4fedff";
  }
  else if (feature.properties.mag <= 3) {
    return color = "#c41200";
  }
  else if (feature.properties.mag <= 4) {
    return color = "#86b324";
  }
  else if (feature.properties.mag <= 5) {
    return color = "#261e06";
  }
  else {
    return color = "#e8ff78";
  }
}

// Add size to the markers
function markerSize(feature) {
  return (feature.properties.mag) * 4;
}

// Add color to the legend
function legendColor(magnitude) {
  if (magnitude < 1) {
      return "#913dff"
  }
  else if (magnitude < 2) {
      return "#4fedff"
  }
  else if (magnitude < 3) {
      return "#c41200"
  }
  else if (magnitude < 4) {
      return "#86b324"
  }
  else if (magnitude < 5) {
      return "#261e06"
  }
  else {
      return "#e8ff78"
  }
}

 // Importing the tactonic plate data and adding the layer 
 var mapStyle = {
  color: "green",
  weight: 4
};
d3.json("static/data/PB2002_boundaries.json", function (data) {
    L.geoJSON(data, {    
      style: mapStyle
  }).addTo(layers["tactonicPlates"]);
});

var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        richterScale = [0, 1, 2, 3, 4, 5],
        labels = [];
    div.innerHTML += "<strong><p>Richter<br> Scale</p>"
    
    for (var i = 0; i < richterScale.length; i++) {
        div.innerHTML +=
            '<i style="background:' + legendColor(richterScale[i]) + '"></i> ' +
            richterScale[i] + (richterScale[i + 1] ? '&ndash;' + richterScale[i + 1] + '<br>' : '+');
    }
    return div;
};

legend.addTo(map);
  