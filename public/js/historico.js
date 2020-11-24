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



function filterUniqueDates(data) {
    const lookup = new Set();
    
    return data.filter(date => {
       const serialised = date;
      if (lookup.has(serialised)) {
        return false;
      } else { 
        lookup.add(serialised);
        return true;
      }
    })
  }

  //Adding a segmento a una linea
var segmento = new ol.Feature({
    //  geometry: new ol.geom.LineString([[-8325240.41,1232759.48],[-8325641.41,1232860.48] ], 'XY')

});

  var linesource = new ol.source.Vector({
    features: [segmento]
  });

  var styleFunction = function (feature) {
    var geometry = feature.getGeometry();
    var styles = [
      // linestring
      new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: '#0026FF',
          width: 1,
        }),
      }) ];
  
    geometry.forEachSegment(function (start, end) {
      var dx = end[0] - start[0];
      var dy = end[1] - start[1];
      var rotation = Math.atan2(dy, dx);
      // arrows
      styles.push(
        new ol.style.Style({
          geometry: new ol.geom.Point(end),
          image: new ol.style.Icon({
            src: 'image/arrow.png',
            // anchor: [0.5, 0.5],
            rotateWithView: true,
            rotation: -rotation,
          }),
        })
      );
    });
  
    return styles;
  };

var stylesegmento = new ol.style.Style({
    stroke: new ol.style.Stroke({
        color: 'brown',
        width: 1.8
    })
});

  var vector = new  ol.layer.Vector({
    source: linesource,
    style: styleFunction
  });

 // add style to Vector layer style map se agrega vacio
map.addLayer(vector);
  // add style to Vector layer style map se agrega vacio
map.addLayer(markerVectorLayer);