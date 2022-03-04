const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
const cors=require('cors');
const candidateRouter = require('./routes/candidate.route'); 

//Extended: https://swagger.io/specification/#infoObject 

// create express app
const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/letsencrypt/live/swipe-up.co.uk/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/swipe-up.co.uk/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/swipe-up.co.uk/chain.pem', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

const httpsServer = https.createServer(credentials, app);
// parse requests of content-type - application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res) => {
	res.send('Hello there !');
});

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

//define port
const port=process.env.PORT || 3000;

//initialize cors middleware
// app.use(cors());

// // parse requests of content-type - application/json
// app.use(bodyParser.json()) //handling the form data

// //define a simple route
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/signUp', candidateRouter);
// listen for requests
httpsServer.listen(port, () => {
	console.log("Server is listening on port",port);
});