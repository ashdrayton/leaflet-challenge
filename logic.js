// Create Map 
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
    });


// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

// Store API query
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Read and return data for visualisation
d3.json(queryUrl, function (data) {
    function createCircles(feature) {
        // Create and bind data to circles 
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Function to define the colour based off the size of magnitude
    function getColor(i) {
        return i > 5 ? '#F30' :
        i > 4  ? '#F60' :
        i > 3  ? '#F90' :
        i > 2  ? '#FC0' :
        i > 1   ? '#FF0' :
                  '#9F3';
      }

    // Get radius for each cicrle based off magnitude size
    function getRadius(magnitude) {
    if (magnitude === 0) {
        return 1;
    }
    return magnitude * 4;
    }  

    L.geoJson(data, {
        // Make cricles
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        // circle style
        style: createCircles,
        // popup for each marker
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + (feature.properties.mag) + "</p>");
        }
    }).addTo(myMap);


    // Creating a legend
    var legend = L.control({ position: 'bottomright' });

    // Define each item
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #00ff00"></i><span>0-1</span><br>';
        div.innerHTML += '<i style="background: #ced901"></i><span>1-2</span><br>';
        div.innerHTML += '<i style="background: #ffff00"></i><span>2-3</span><br>';
        div.innerHTML += '<i style="background: #fca200"></i><span>3-4</span><br>';
        div.innerHTML += '<i style="background: #fc4900"></i><span>4-5</span><br>';
        div.innerHTML += '<i style="background: #fa0000"></i><span>5+</span><br>';
        return div;
    };

    legend.addTo(myMap);
})