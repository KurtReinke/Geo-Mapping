        //Import urls, API_KEY
var earth_url= "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var plate_url= "https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json"
       
        //Define Groups
//var earth=new L.LayerGroup();
//var plates= new L.LayerGroup();

            //mag layer

function getColor(mag) {
    return mag > 5 ? "#f40202" :
           mag > 4 ? "#f45f02" :
           mag > 3 ? "#f49702" :
           mag > 2 ? "#F4bc02" :
           mag > 1 ? "#d8f402" :
           mag > 0 ? "#93f402" :
                "#FFEDA0";
}


            //CreateMap

function createMap() {
            // Define Maps: streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }); 
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });
    var terrainmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });
     


    var earth= new L.LayerGroup();

            //Define Overlays
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Terrain Map": terrainmap
    };
    var overlays = {
        earthquakes: earth,

    }



            //Create MyMap
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 3,
        layers: [streetmap, earth]
    });

            // Create a layer control, Pass in our baseMaps and overlayMaps, Add the layer control to the map
    L.control.layers(baseMaps, overlays).addTo(myMap);

    d3.json(earth_url, function(earthquakeData) {
        L.geoJSON(earthquakeData, {
            //circlelayer:function(feature, location){
            //    return L.cc(location)
            //},
            pointToLayer:function(feature,latlng){
                return L.circleMarker(latlng)
            },
            style: function(feature) {
                return {
                    color: "black",
                    fillColor: getColor(feature.properties.mag),
                    fillOpacity: 0.85,
                    opacity: 1,
                    weight: 1,
                    stroke: true,
                    radius: feature.properties.mag*4.5
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup("<h3>" + feature.properties.place +
                "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
            }
        }).addTo(earth)
    });
}

// d3.json(earth_url, function(earthquakeData) {
//     L.geoJSON(earthquakeData, {
//         //circlelayer:function(feature, location){
//         //    return L.cc(location)
//         }
//     }).addTo(myMap)
// });
// }



createMap()



//`<i style='background: "${colors[i]}"'></i>`

//function createFeatures(earthquakeData) {
var legend = L.control({position: "bottomright"});

legend.onAdd = function(map) {
    var legend2 = L.DomUtil.create("div", "info legend"), 
    levels = [0, 1, 2, 3, 4, 5];
    labels = [];

    for (var i = 0; i < levels.length; i++) {
        legend2.innerHTML +=
            '<i style="background: ' + getColor(levels[i]) + '"></i> ' +
            levels[i+1] + (levels[i] ? '&ndash;' + levels[i + 1] + '<br>' : '+');
    }
    return legend2;
}
legend.addTo(map);
