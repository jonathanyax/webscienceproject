/*
 * Module dependencies
 */
var express = require('express'),
		jade    = require('jade'),
		socket  = require('socket.io'),
		stylus  = require('stylus'),
		nib     = require('nib'),
		routes  = require('./routes'),
		mongoose = require('mongoose')

// set up express app
var app = express()

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib())
}

// set default node environment variables to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// connect to mongo db
var db = mongoose.connection;
db.on('error', console.error);

// use Jade and get views from '/views' directory
app.set('views', __dirname + '/views')
app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'jade')

// middleware to compile .styl files to CSS
app.use(stylus.middleware(
	{ src: __dirname + '/public',
	  compile: compile
	}
))

// static files in '/public' directory
app.use(express.static(__dirname + '/public'))

// run!
app.use('/', routes)

// app.listen(3000, function() {
// 	console.log('Server up on port 3000')
// })

app.listen(app.get('port'), function() {
  console.log("OnPoint is running on:" + app.get('port'))
})
