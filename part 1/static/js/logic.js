let myMap= L.map("map",{
    center: [20.0, 5.0],
    zoom: 2
});

// Add title layer
L.titleLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Earthquake data url
let earthquakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Function to determine the marker radius based on earthquake magnitude
function getRadius(magnitude){
    return magnitude ? magnitude * 4 : 1;
}

// function to determine the marker color based on the earthquake depth (green to red)
function getColor(depth){
    if (depth <= 10) return "#00FF00"; // green (shallow)*
    else if (depth <= 30) return "#ADFF2F"; // light green*
    else if (depth <= 50) return "#FFD580"; // light orange*
    else if (depth <= 70) return "#FFA500"; // orange*
    else if (depth <= 90) return "#FF4500"; // dark orange*
    else return "#FF0000"; // red (deep)*
}

//Fetch earthquake data and plot ot on the map
d3.json(earthquakeData).then(function (data){
    let geojson = L.geoJSON(data,{
        pointToLayer: function (feature, latlng){
            return L.circleMarker(latlng,{
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: '#000',
                weight: 1,
                opacity: 1, 
                fillOpacity: 0.8
            });
        }
    })
})