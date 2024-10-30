// Initialize the map
var map = L.map('map').setView([0, 0], 2); // Center the map around the world
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

// Earthquake data url
let earthquakeData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


// Define functions
//Function to create markers on the map
function createMarkers(earthquakes) {
    if (earthquakes.features && Array.isArray(earthquakes.features)) {
    earthquakes.features.forEach(feature => {
        var coords = feature.geometry.coordinates;
        var magnitude = feature.properties.mag;
        var depth = coords[2];

        // Determine marker size and color based on magnitude and depth
        var markerSize = magnitude * 5; // Adjust size multiplier as needed
        var markerColor = getColor(depth);

        var circleMarker = L.circleMarker([coords[1], coords[0]], {
            radius: markerSize,
            fillColor: markerColor,
            color: markerColor,
            fillOpacity: 0.6,
            stroke: false
        }).addTo(map);

        // Add tooltip with additional information
        circleMarker.bindTooltip(`<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km<br><a href="${feature.properties.url}" target="_blank">More Info</a>`, 
            {
            permanent: false, // Tooltip will only show on hover
            sticky: true // Tooltip stays open while hovering over the marker
    });
});
}
}

// Function to get color based on depth
function getColor(depth) {
    return depth > 100 ? '#700e01' : // Deep red
           depth > 50  ? '#d53600' : // red
           depth > 20  ? '#ff8503' : // orange
           depth > 0   ? '#feb204' : // medium yellow
                         '#FFE895';  // yellow for depths <= 0
}

// Call the function to create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [0, 20, 50, 100];

    // Add a heading to the legend
    div.innerHTML += '<h4>Magnitude of earthquake by depth</h4>'; // Change "Depth Legend" to your desired heading

    // Create a container for the legend items
    var itemContainer = L.DomUtil.create('div');

    for (var i = 0; i < depths.length; i++) {
        var item = L.DomUtil.create('div', 'legend-item');
        item.innerHTML =
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km' : '+ km');
        itemContainer.appendChild(item);
    }

    div.appendChild(itemContainer); // Append the item container to the legend
    return div;
};

legend.addTo(map);



// Fetch the earthquake data
fetch(earthquakeData)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        createMarkers(data); // Pass the fetched data to createMarkers
    })
    .catch(error => {
        console.error('Error fetching earthquake data:', error);
    });
