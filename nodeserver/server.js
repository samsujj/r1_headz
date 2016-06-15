/**
 * Created by iftekar on 24/5/16.
 */


var express = require('express');

//var busboy = require('connect-busboy'); //middleware for form/file upload
//var path = require('path');     //used for file path
//var fs = require('fs-extra');
var app = express();
//app.use(busboy());// create our app w/ express
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


var http = require('http').Server(app);





var bodyParser = require('body-parser');
app.use(bodyParser.json({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10}));
app.use(bodyParser.urlencoded({ parameterLimit: 1000000,
    limit: 1024 * 1024 * 10, extended: false}));
var multer  = require('multer');
var datetimestamp='';
var filename='';
var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {

        //console.log(file);
        filename=file.originalname.split('.')[0].replace(' ','') + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1];
        cb(null, filename);
    }
});

var upload = multer({ //multer settings
    storage: storage
}).single('file');


app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
//app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request*/

/*app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies*/


// routes ======================================================================
//require('./app/routes.js')(app);

// listen (start app with node nodeserver.js) ======================================




app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



/** API path that will upload the files */
app.post('/uploads', function(req, res) {

    datetimestamp = Date.now();
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        res.json({error_code:0,filename:filename});
    });
});



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

    var mailer = require("nodemailer");

    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: "Yashwant Chavan <john71838@gmail.com>",
        to: "debasiskar007@gmail.com",
        subject: "Send Email Using Node.js",
        //text: "Node.js New world for me",
        html: "<b>Node.js New world for me</b>"
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        resp.send((response.message));
        smtpTransport.close();
    });

    console.log('success full query');
    //resp.send('Hello'+rows[0].fname);


});
app.post('/newcontact1',function(req,resp){


    resp.header('Content-type: text/html');
    resp.header("Access-Control-Allow-Origin", "*");  //I have also tried the * wildcard and get the same response
    resp.header("Access-Control-Allow-Credentials: true");
    resp.header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    resp.header('Access-Control-Max-Age: 1000');
    resp.header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');

    var mailer = require("nodemailer");

    // Use Smtp Protocol to send Email
    var smtpTransport = mailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "itplcc40@gmail.com",
            pass: "DevelP7@"
        }
    });

    var mail = {
        from: req.body.fullname+" <"+req.body.email+">",
        to: "iftekarkta@gmail.com",
        subject: "New Contact Form Submission by "+req.body.fullname,
        //text: "Node.js New world for me",
        html: "<b>Name</b> :   "+req.body.fullname +"<br><b>Email</b> :   "+req.body.email+ "<br><b>Phone Number</b> :   "+req.body.phone_no +"<br><b>Message</b> :   "+req.body.message ,
    }

    smtpTransport.sendMail(mail, function(error, response){
        if(error){
            console.log(error);
        }else{
            console.log("Message sent: " + response.message);
        }

        resp.send((response.message));
        smtpTransport.close();
    });

    console.log('success full query');
    //resp.send('Hello'+rows[0].fname);


});


app.get('/listcontent', function (req, resp) {
    connection.query("SELECT * FROM contentmanager ",function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });
});


app.get('/contentlistbyid/:id', function (req, resp) {
    connection.query("SELECT * FROM contentmanager where id = ? or parentid = ?",[req.params.id,req.params.id],function(error,rows,fields){

        if(!!error) console.log('error in db call ');
        else{

            console.log('success full query');
            //resp.send('Hello'+rows[0].fname);
            resp.send(JSON.stringify(rows));
        }

    });
});





app.post('/adddata', function (req, resp) {



   /* res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
*/
    resp.header('Content-type: text/html');
    resp.header("Access-Control-Allow-Origin", "*");  //I have also tried the * wildcard and get the same response
    resp.header("Access-Control-Allow-Credentials: true");
    resp.header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
    resp.header('Access-Control-Max-Age: 1000');
    resp.header('Access-Control-Allow-Headers: Content-Type, Content-Range, Content-Disposition, Content-Description');
    //resp.send(('name : '+req.body.cname+' content:' +req.body.ctext+' ctype : '+req.body.ctype+'desc :'+req.body.description));
    var content='';
    if(req.body.ctype=='html') content= (req.body.chtml);
    if(req.body.ctype=='text') content= (req.body.ctext);
    if(req.body.ctype=='image') content= req.body.image_url_url;

    ///console.log(JSON.parse(content));
    if(typeof (req.body.parentid)=='undefined') var parentid=0;
    else var parentid=req.body.parentid;
    var addtime=Date.now();

    value1 = {cname: req.body.cname, content: content, ctype: req.body.ctype,description:req.body.description,parentid:parentid,addtime:addtime};
console.log("Insert command");
connection.query('INSERT INTO contentmanager SET ?', value1, function (err,result) {
    if (err) {
        console.log("ERROR IN QUERY");
    } else {
        console.log("Insertion Successful." + result);
        console.log('Inserted ' + result.affectedRows + ' rows');
        resp.send(result);
    }
});
    //resp.send((req));


});



app.post('/upload',function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    console.log(req.body.Filedata);
    console.log(JSON.stringify(req));



    var tmp_path = req.files.Filedata.path;
    // set where the file should actually exists
    var target_path = './uploads/' + req.files.Filedata.name;
    // move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
        fs.unlink(tmp_path, function() {
            if (err) {
                throw err;
            }else{
                var profile_pic = req.files.userPhoto.name;
                //use profile_pic to do other stuffs like update DB or write rendering logic here.
            };
        });
    });
});


var server = app.listen(port, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

//app.listen(port);

/*app.listen(port);
console.log("App listening on port " + port);*/
