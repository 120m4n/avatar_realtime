#!/usr/bin/env nodejs

const { db_connect } = require('./config');
var url = db_connect;


const express = require('express');
var bodyParser = require('body-parser');
var mongodb = require("mongodb");
var app = express();
var http = require('http');
// var https  = require('https');

// var options = {  
//     key: fs.readFileSync('./key.pem', 'utf8'),  
//     cert: fs.readFileSync('./server.crt', 'utf8') 
// };
// var server = https.createServer(options, app);


// set the view engine to ejs
app.set('view engine', 'ejs');


var server = http.createServer(app);
var collectionName = "central_location";
var historicTable = "historic_location";


app.use(bodyParser.json());

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }
  
// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;
const markers = [];

function clearArray(array) {
  while (array.length) {
    array.pop();
  }
}

function crearMarkers(result){
    var i;
    clearArray(markers);
    for (i = 0; i < result.length; i++) {
        markers.push(result[i]);
        // console.log(result[i]);
    }

}


//settings
app.set('port', process.env.PORT || 3000);
// Express Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
// app.use(function(res,req,next){
//   console.log('otro');
//   next();
// });


// Connect to the database before starting the application server.
mongodb.MongoClient.connect(url, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  db.collection(collectionName).find({},{_id:0}).toArray(function(err, result) {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    //console.log(result);
    crearMarkers(result);

    });

  // Initialize the app.
  server.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    var date = new Date();
    console.log(date)
    console.log("App now running on port", port);
  });

  

});

// use res.render to load up an ejs view file
function getHistorico (name) {
  return new Promise(function(resolve, reject) {
    db.collection(historicTable).find({'user_id' : name},{_id:0, user_id:0}).toArray( function(err, docs) {
      if (err) {
        // Reject the Promise with an error
        return reject(err)
      }

      // Resolve (or fulfill) the promise with data
     
      return resolve(docs)
    })
  })
}

function extentMeters(limit){
  var xmin, ymin, xmax, ymax;
  var temp = limit.split(',');
  xmin = parseFloat(temp[0]);
  xmax = xmin + 1;
  ymin = parseFloat(temp[1]);
  ymax = ymin + 1;

  return [xmin, ymin, xmax, ymax];
}

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



// index page
app.get('/historico', function(req, res) {

  let name = req.query.name;
  let limit = req.query.limit;


  var avatar = "user_id : "+name ;

 

  if(name && limit) { 

    var extent =  extentMeters(limit)
    //console.log(extent);

    db.collection(historicTable).find({'user_id' : name},{_id:0, user_id:0, timespan:0}).toArray( function(err, rows) {
      if(err) throw err;

      // var vector = '[[111,12],[112, 13],[111, 13]]';
      var vector =[];
      var fechas =[];

      // console.log(rows)
      
      // rows.forEach(function(word) {
      //   //console.log(word.location);
      //   vector.push(word.location);
      //   fechas.push(word.fecha.toISOString().split('T')[0])
      // });


      // console.log(filterUniqueDates(fechas));
      
      res.render('pages/historico', {
        avatar: avatar,
        data: rows,
        limit: JSON.stringify(extent)
      })
    });


    
  } else{


  }



});

//Serve a Publisher HTML
// app.get('/publish', function (req, res) {
app.get('/', function (req, res,next) {
  res.sendFile('views/publisher.html', {
      root: __dirname
  });
  next();
},function(req, res,next){
  db.collection(collectionName).find({},{_id:0}).toArray(function(err, rows) {
    if(err) throw err;
    crearMarkers(rows);
  });

});

// // Render Main HTML file
app.get('/test', function (req, res) {
  res.sendFile('views/index.html', {
      root: __dirname
  });
});

var flag_maker = false;

app.post("/api/test", function(req, res,next) {
  console.log(req.body);
  res.status(200).json({
    status: 1,
    message: 'new doc created.'
    
  })
});

app.post("/api/pushLocation", function(req, res,next) {
    
    user_id = req.body.user_id;
    arrayOfLocations = req.body.locations;
    var d = new Date();
    var timeUNIX = d.getTime();
    var timeHMS = d.getHours() + ':'+ d.getMinutes()+ ':'+d.getSeconds() 

    // var fechaYYYYMMDD = d.toISOString()
    
    if(user_id && arrayOfLocations) { 
        db.collection(collectionName).findOne({'user_id' : user_id},function(err,result){
            if(err) {
                handleError(res, err.message, "couldn't find user.");
            }
            else {
                flag_maker = true;
                if(result) {
                    updated_locations = arrayOfLocations; 
                    db.collection(collectionName).updateOne({'user_id' : user_id},{ $set: { location: updated_locations, timespan: timeHMS, fecha: new Date() } },function(err,res){
                        if(err) throw err;
                        //console.log('actualizo');

                        db.collection(collectionName).find({},{_id:0}).toArray(function(err, rows) {
                          if(err) throw err;
                          // crearMarkers(rows);
                          io.emit("avatares", rows);
                        });
                    });

                    
                    db.collection(historicTable).insertOne({ user_id: user_id, location: arrayOfLocations, timespan: timeUNIX, fecha: new Date()},function(err,res){
                      if(err) throw err;
                      // console.log('inserto');

                    });

                           
                }
                else {
                    //crearMarkers(arrayOfLocations);
                    db.collection(collectionName).insertOne({ user_id: user_id, location: arrayOfLocations, timespan: timeHMS, fecha: new Date()},function(err,res){
                        if(err) throw err;
                        // console.log('inserto');

                        db.collection(collectionName).find({},{_id:0}).toArray(function(err, rows) {
                          if(err) throw err;
                          // crearMarkers(rows);
                          io.emit("avatares", rows);
                        });
                    });

                    db.collection(historicTable).insertOne({ user_id: user_id, location: arrayOfLocations, timespan: timeUNIX, fecha: new Date()},function(err,res){
                      if(err) throw err;
                      // console.log('inserto');

                    });


            
                }

            }
        })
        res.status(200).json({
            status: 1,
            message: 'new doc created.'
        })


    }
    else {
        res.status(200).json({
            status: -1,
            message: 'user_id or location array not recieved.'
        })
    }
next();
},
function(req,res,next){
  // console.log(flag_maker)
});

var io = require('socket.io').listen(server);

  io.sockets.on('connection',function (socket) {
      for (let i = 0; i < markers.length; i++){
          socket.emit("marker", markers[i]);
      }
      console.log('socket created');
      let previousId;
      const safeJoin = currentId => {
          socket.leave(previousId);
          socket.join(currentId);
          previousId = currentId;
        };
      
      socket.on('disconnect', function() {
        console.log('Got disconnect!');
      });
    
      socket.on("marker", function (data) {
          console.log(data);
        markers.push(data);
        io.emit("marker", data)
      });
      
      socket.on('lastKnownLocation', function () {
        console.log('incoming Geosocket:');
      //   if (flag_maker == true){
      //     db.collection(collectionName).find({},{_id:0, user_id:0}).toArray(function(err, result) {
      //     if (err) {
      //       console.log(err);
      //       process.exit(1);
      //     }
      //     //console.log(result);
      //     crearMarkers(result);
      //     for (let i = 0; i < markers.length; i++){
      //       socket.emit("marker", markers[i]);
      //     }
      
      //     });
      // }
      });
});

// function sendMakers(){
//   for (let i = 0; i < markers.length; i++){
//     io.emit("avatares", markers[i]);
//   }
// }

