// Full Documentation - https://docs.turbo360.co
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const express = require('express')
var bodyParser     =        require("body-parser");

const app = express() // initialize app
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
  });
/*  
	Apps can also be initialized with config options as shown in the commented out example below. Options
	include setting views directory, static assets directory, and database settings. To see default config
	settings, view here: https://docs.turbo360.co

const config = {
	views: 'views', 							// Set views directory 
	static: 'public', 							// Set static assets directory
	logging: true,
	// controllers: require('./controllers'), 	// only for CMS integration
	db: vertex.nedb()
}

vertex.configureApp(app, config) // remove line 30 below and replace with this
*/

vertex.configureApp(app)
app.use(vertex.setContext(process.env))


// import routes
const index = require('./routes/index')
const api = require('./routes/api')

// set routes
app.use('/', index)
app.use('/api', api) // sample API Routes


module.exports = app