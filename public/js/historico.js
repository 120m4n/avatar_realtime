// default zoom, center and rotation
var zoom = 12;
var center = ol.proj.fromLonLat([-74.8038, 10.9983]);
var rotation = 0;

var view = new ol.View({
    //center: ol.proj.fromLonLat([-74.8038, 10.9983]),
    center: center,
    zoom: zoom,
    rotation: rotation,
    maxZoom: 20
});

var baseMapLayer = new ol.layer.Tile({
    source: new ol.source.OSM(),
    maxZoom: 20,
    opacity: 0.6,
});

//Construct the Map Object
var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer],
    view: view
});

var style_marker = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 3.5,
        fill: new ol.style.Fill({
            color: 'rgba(243, 15, 22)'}),
        stroke: new ol.style.Stroke({
            color: [0,0,0], width: 0.5
            })
    })
});

//Adding a marker on the map
var marker = new ol.Feature({
    // geometry: new ol.geom.Point(
    //     ol.proj.fromLonLat([80.24586,12.9859])
    // )
});

// marker.setStyle(iconStyle);
var vectorSource = new ol.source.Vector({
    features: [marker]
});
var markerVectorLayer = new ol.layer.Vector({
    name: 'historico',
    source: vectorSource,
    style:style_marker
});

// add style to Vector layer style map
map.addLayer(markerVectorLayer);

