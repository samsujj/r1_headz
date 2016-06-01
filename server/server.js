/**
 * Created by iftekar on 24/5/16.
 */


var express = require('express');
var app = express(); 						// create our app w/ express
//var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 8085; 				// set the port
//var database = require('./config/database'); 			// load the database config
//var morgan = require('morgan');
/*var bodyParser = require('body-parser');
var methodOverride = require('method-override');*/

/*// configuration ===============================================================
//mongoose.connect(database.localUrl); 	// Connect to local MongoDB instance. A remoteUrl is also available (modulus.io)

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
//app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/


// routes ======================================================================
//require('./app/routes.js')(app);

// listen (start app with node server.js) ======================================


var mysql=require('mysql');

var connection =mysql.createConnection({
    host:'influxiq.com',
    user:'influxiq_urbanh',
    password:'P@ss7890',
    database:'influxiq_urbanh'

});

connection.connect(function(error){

    if(!!error){
        console.log('error')
    } else{
        console.log('connected');
    }

});

app.get('/',function(req,resp){

    connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });

});



app.get('/listUsers', function (req, resp) {
    connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });
});



app.get('/adddata', function (req, resp) {
    
  var user_id = req.param('id');
  var token = req.param('token');
  var geo = req.param('geo');  

  resp.send(user_id + ' ' + token + ' ' + geo);

});

var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

//app.listen(port);

/*app.listen(port);
console.log("App listening on port " + port);*/
