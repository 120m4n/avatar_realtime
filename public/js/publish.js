// default zoom, center and rotation
var zoom = 12;
var center = ol.proj.fromLonLat([-74.8038, 10.9983]);
var rotation = 0;

if (window.location.hash !== '') {
  // try to restore center, zoom-level and rotation from the URL
  var hash = window.location.hash.replace('#map=', '');
  var parts = hash.split('/');
  if (parts.length === 4) {
    zoom = parseInt(parts[0], 10);
    center = [
      parseFloat(parts[1]),
      parseFloat(parts[2])
    ];
    rotation = parseFloat(parts[3]);
  }
}

var shouldUpdate = true;

var view = new ol.View({
    //center: ol.proj.fromLonLat([-74.8038, 10.9983]),
    center: center,
    zoom: zoom,
    rotation: rotation,
    maxZoom: 20
});


// function switch_eval(context) {
//     //varios circuitos
//     var feature = context.feature;
//     var color = '';
//     var expr = feature.get('CIRCUITO')
//     var temp = String(expr ) 
//     var n = temp.search("20");
    
//     color = 'rgba(0, 0, 254, 0.7)';
    
//     if ((n > -1) && (n = 3))  {
//         color='rgba(0,0, 254, 0.7)'; 
//     } 
      
//     n = temp.search("30");
//     if ((n > -1) && (n = 3))  {
//         color='rgba(254,0, 0, 1.0)'; 
//     }  

//     n = temp.search("40");
//     if ((n > -1) && (n = 3))  {
//         color='rgba(255, 29, 206, 0.8)';
//     }      

//     return color;
// }

function resolultion_eval(context) {
    //varios circuitos
    var feature = context.feature;
    var grosor = 1.2;
    var expr = feature.get('CIRCUITO')
    var temp = String(expr ) 
    var n = temp.search("20");
    if ((n > -1) && (n = 3))  {
        grosor = 1.2 
    } 
      
    n = temp.search("30");
    if ((n > -1) && (n = 3))  {
        grosor = 3
    }  

    n = temp.search("40");
    if ((n > -1) && (n = 3))  {
        grosor = 3
    }      

    return grosor;
}
// "http://localhost:8080/maps/essa/tramomt/{z}/{x}/{y}.pbf"],"minzoom":5,"maxzoom":20},
// "http://localhost:8080/maps/essa/apoyos/{z}/{x}/{y}.pbf"],"minzoom":15,"maxzoom":20}
// "http://localhost:8080/maps/essa/pconsumo/{z}/{x}/{y}.pbf"],"minzoom":15,"maxzoom":20}

// "http://34.68.181.212:8080/maps/essa/tramomt/{z}/{x}/{y}.pbf"
// "http://34.68.181.212:8080/maps/essa/apoyos/{z}/{x}/{y}.pbf"
// "http://34.68.181.212:8080/maps/essa/pconsumo/{z}/{x}/{y}.pbf"

var styletrafos =new ol.style.Style({
    image: new ol.style.Icon({
    scale: 1,
    src: "image/transformador.svg"
    })
});

// var styleinterrup = new ol.style.Style({
    // image: new ol.style.Icon({
    // scale: 0.8,
    // src: "image/interrup.svg"
    // })
// });

var style_pconsumo = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 3,
    fill: new ol.style.Fill({
        color: 'rgba(171, 212, 89)'}),
    stroke: new ol.style.Stroke({
      color: [0,0,0], width: 0.5
    })
  })
});

// var style_apoyos = new ol.style.Style({
  // image: new ol.style.Circle({
    // radius: 5,
    // fill: new ol.style.Fill({
        // color: 'rgba(227, 237, 16, 0.8)'}),
    // stroke: new ol.style.Stroke({
      // color: [0,0,0], width: 0.5
    // })
  // })
// });


var style_apoyos = new ol.style.Style({
  image: new ol.style.Circle({
    radius: 4.0,
    stroke: new ol.style.Stroke({
      color: 'rgba(0,0,0,1.0)', 
      lineDash: null, 
      lineCap: 'butt', 
      lineJoin: 'miter', 
      width: 0}),
    fill: new ol.style.Fill({
      color: 'rgba(0,0,0,0.8)'
    })
  })
});

var style_tramomt = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
   return [ new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: switch_eval(context),
                width: resolultion_eval(context) //resolution > 10 ? 1.5 : 2.0
            })
        })]; 
 }; 


var vtramomt = new ol.layer.VectorTile({
    title: 'Tramos MT',
    source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url:'http://34.68.181.212:8080/maps/essa/tramomt/{z}/{x}/{y}.pbf'
    }),
    minZoom: 7,
    maxZoom: 20,
    style: style_tramomt
});

var vapoyo = new ol.layer.VectorTile({
    title: 'Apoyos',
    source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url:'http://34.68.181.212:8080/maps/essa/apoyos/{z}/{x}/{y}.pbf'
    }),
    minZoom: 17,
    maxZoom: 20,
    style: style_apoyos

});

var vpconsumo = new ol.layer.VectorTile({
    title: 'PuntoConsumo',
    source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url:'http://34.68.181.212:8080/maps/essa/pconsumo/{z}/{x}/{y}.pbf'
    }),
    minZoom: 18,
    maxZoom: 20,
    style: style_pconsumo

});

var vtrafos = new ol.layer.VectorTile({
    title: 'Trafos',
    source: new ol.source.VectorTile({
        format: new ol.format.MVT(),
        url:'http://34.68.181.212:8080/maps/essa/trafos/{z}/{x}/{y}.pbf'
    }),
    minZoom: 17,
    maxZoom: 20,
    style: styletrafos

});



var baseMapLayer = new ol.layer.Tile({
    //source: new ol.source.XYZ({
    //  url: 'https://c.tile.thunderforest.com/transport/{z}/{x}/{y}.png'
    //}),
    source: new ol.source.OSM(),
    maxZoom: 20,
    opacity: 0.6,

});

//Construct the Map Object
var map = new ol.Map({
    target: 'map',
    layers: [ baseMapLayer, vtramomt, vapoyo, vpconsumo, vtrafos],
    view: view
});

// ol.hash(map);

//GEolocalizacion
// var geolocation = new ol.Geolocation({
//     // enableHighAccuracy must be set to true to have the heading value.
//     trackingOptions: {
//       enableHighAccuracy: true
//     },
//     projection: view.getProjection()
// });

var styleclientes = new ol.style.Style({
    image: new ol.style.Circle({
      radius: 3,
      fill: new ol.style.Fill({
          color: 'rgba(82, 82, 210, 1)'}),
      stroke: new ol.style.Stroke({
        color: [0,0,0], width: 0.5
      })
    })
  });

  //Set up an  Style for the marker note the image used for marker
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      src: 'image/avatar_red.png'
    })),
    text: new ol.style.Text({
      text: 'TONIJAS',
      fill: new ol.style.Fill({
        color: 'black'
      }),
      textAlign: 'center',
      textBaseline: 'top',
      offsetY: -22,
      offsetX: 0
    })
});



var style_avatar = function(feature, resolution){
  let properties = feature.getProperties();
 return [ new ol.style.Style({
            image: new ol.style.Icon(/** @type {module:ol/style/Icon~Options} */ ({
              anchor: [0.3, 0.3],
              anchorXUnits: 'fraction',
              anchorYUnits: 'fraction',
              src: 'image/avatar_red.png'
            })),
            text: new ol.style.Text({
              text: resolution > 8 ? "" : properties.name + ' : ' +properties.timespan,
              fill: new ol.style.Fill({
                color: 'white'
              }),
              backgroundFill: new ol.style.Fill({
                color: [0,60,136,0.7]
              }),
              padding : [1, 0, 0,1],
              textAlign: 'center',
              textBaseline: 'top',
              offsetY: -22,
              offsetX: 0
            })
          })]; 
};   

// function el(id) {
//     return document.getElementById(id);
// }

// el('track').addEventListener('change', function() {
//     geolocation.setTracking(this.checked);
// });

// handle geolocation error.
// geolocation.on('error', function(error) {
//     var info = document.getElementById('info');
//     info.innerHTML = error.message;
//     info.style.display = '';
// });

var positionFeature = new ol.Feature();
// geolocation.on('change:position', function() {
//     var coordinates = geolocation.getPosition();
//     positionFeature.setGeometry(coordinates ?
//       new ol.geom.Point(coordinates) : null);
// });


var markerGeoVector = new ol.layer.Vector({
    source: new ol.source.Vector({
      features: [positionFeature]
    }),
    style: iconStyle //styleclientes
});

map.addLayer(markerGeoVector);



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
    name: 'avatares',
    source: vectorSource,
    style: style_avatar
});

// add style to Vector layer style map
map.addLayer(markerVectorLayer);


//conexion del socket
const socket = io({ transports: ['websocket'] });

socket.on("marker", function(data){
    // console.log(data);
    function addMarker(temp){
        let markerpoint = new ol.Feature({
            geometry: new ol.geom.Point(
                ol.proj.fromLonLat([temp.location[0], temp.location[1]])
            )
        });
    markerpoint.set('name', temp.user_id);
    if (temp.hasOwnProperty('timespan')){
           markerpoint.set('timespan', temp.timespan) 
        }
    return markerpoint
    }
    //vectorSource.clear();
    vectorSource.addFeature( addMarker(data));
});

socket.on("avatares", function(data){
  var i,temp,lat,lon, geom, feature, features = [];
    // console.log(data)
    vectorSource.clear();
    for (i=0; i< data.length; i++){
        temp = data[i].location;
        lat = temp[1];
        lon = temp[0];
       // console.log([lon,lat])
        geom = new ol.geom.Point(
			ol.proj.transform([lon,lat], 'EPSG:4326', 'EPSG:3857')
        );
        feature = new ol.Feature(geom);
        // console.log(data[i].user_id);

        feature.set('name', data[i].user_id);
        //agregado timespan
        if (data[i].hasOwnProperty('timespan')){
           feature.set('timespan', data[i].timespan) 
        }
          
		features.push(feature);
    }
    vectorSource.addFeatures(features);

});
  
function updateCoordinate(item) { 
    // Structure of the input Item
    // {"Coordinate":{"Longitude":80.2244,"Latitude":12.97784}}    
    var featureToUpdate = marker;
    var coord = ol.proj.fromLonLat([item.Coordinate.Longitude, item.Coordinate.Latitude]);
    featureToUpdate.getGeometry().setCoordinates(coord);
}


var updatePermalink = function() {
  if (!shouldUpdate) {
    // do not update the URL when the view was changed in the 'popstate' handler
    shouldUpdate = true;
    return;
  }

  var center = view.getCenter();
  var hash = '#map=' +
      view.getZoom() + '/' +
      Math.round(center[0] * 100) / 100 + '/' +
      Math.round(center[1] * 100) / 100 + '/' +
      view.getRotation();
  var state = {
    zoom: view.getZoom(),
    center: view.getCenter(),
    rotation: view.getRotation()
  };
  window.history.pushState(state, 'map', hash);
};

map.on('moveend', updatePermalink);

// restore the view state when navigating through the history, see
// https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
window.addEventListener('popstate', function(event) {
  if (event.state === null) {
    return;
  }
  map.getView().setCenter(event.state.center);
  map.getView().setZoom(event.state.zoom);
  map.getView().setRotation(event.state.rotation);
  shouldUpdate = false;
});
// geolocation.on('change:position', function() {
//     var coordinates = geolocation.getPosition();
//     positionFeature.setGeometry(coordinates ?
//       new ol.geom.Point(coordinates) : null);
//     socket.emit("lastKnownLocation", coordinates);
// });

// map.on(['pointermove'], showInfo);

// var info = document.getElementById('info');



// function showInfo(event) {

//   let hit = map.getFeaturesAtPixel(event.pixel, function(layer) {
//     return layer.get('name') === 'avatares'; // boolean
//   });
  
//   if (hit.length == 0) {
//     info.innerText = '';
//     info.style.opacity = 0;
//     return;
//   }
//   //console.log(hit)

//   let properties = hit[0].getProperties();
//   delete properties['geometry'];
//   info.innerText = JSON.stringify(properties, null, 2);
//   info.style.opacity = 1;
// }

// map.on('click', function(evt){
//     let _tempcoor = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
//     // var item = {};
//     // item.Coordinate = {};
//     // item.Coordinate.Longitude = _tempcoor[0];
//     // item.Coordinate.Latitude = _tempcoor[1];
//     // updateCoordinate(item);
//     //console.log();
//     // function addMarker(coord){
//     //     let markerpoint = new ol.Feature({
//     //         geometry: new ol.geom.Point(
//     //             ol.proj.fromLonLat([_tempcoor[0], _tempcoor[1]])
//     //         )
//     //     });
//     //     return markerpoint
//     // }

//     // vectorSource.addFeature( addMarker(_tempcoor));
//     socket.emit("marker", _tempcoor)
// });
// var longlats =
// [[80.24586,12.98598],
// [80.24537,12.98597],
// [80.24522,12.98596],
// [80.24522,12.98614],
// [80.24523,12.98626]];
// const socket = io({ transports: ['websocket'] });
// var count = 1;
// setInterval(function() {
//   console.log(count);
//   if (count < 10000){
//     var item = {};
//     item.Coordinate = {};
//     item.Coordinate.Longitude = longlats[count % 5][0];
//     item.Coordinate.Latitude = longlats[count % 5][1];
//     count++;
//     socket.emit('lastKnownLocation', item);
//   }
// }, 5000);


var element = document.getElementById('popup');

var popup = new ol.Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});

map.addOverlay(popup);

// display popup on click
map.on('singleclick', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  },{
    layerFilter: function (layer) {
      return layer.get('name') === 'avatares';
    }
  }
  
  );
  $(element).popover('dispose');
  if (feature) {
    
    var coordinates = feature.getGeometry().getCoordinates();
    var name = feature.get('name');
    
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      // content: '<h1>'+ feature.get('name') + feature.get('population') + '</h1>',
      content: '<a href="/historico?name=' + name +'&limit='+ coordinates +'">Historico: ' + name + '</a>',
    });
    $(element).popover('show');


  } else {
    // $(element).popover('destroy');
  }
  
});




