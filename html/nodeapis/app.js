const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cors=require('cors');
const path = require("path");
const candidateRouter = require('./routes/candidate.route');
const adminRouter = require('./routes/admin.route');
const employerRouter = require('./routes/employer.route');
var fs = require('fs');
//Extended: https://swagger.io/specification/#infoObject 

// create express app
const app = express();
// --- today add this ----
global.__basedir = __dirname;
//
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")
//const bodyParser = require('body-parser');
//app.use(bodyParser.json({limit: '50mb'})); 
// ------ today add this ----
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({limit: '50mb'}))
   .use(bodyParser.urlencoded());

// Configuring the database
const db = require('./config/db.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(db.database, {
	useNewUrlParser: true
}).then(() => {
	console.log("Successfully connected to the database");    
}).catch(err => {
	console.log('Could not connect to the database. Exiting now...', err);
	process.exit();
});

const port=3000;

//initialize cors middleware
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin,Content-Type, Content-Length, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    //req.con = con
    next();
});

// parse requests of content-type - application/json
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:false})); //handling the form data

//define a simple route
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use('/Candidate', candidateRouter);
app.use('/Admin', adminRouter);
app.use('/Employer', employerRouter);

app.get('/', (req, res) => {
 res.send('<h1>Hello</h1>')
});
// Starting both http & https servers

app.listen(3000, function() {
    console.log("Working on port 3000");
});