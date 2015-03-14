/*
 * Module dependencies
 */
var express = require('express'),
		jade    = require('jade'),
		socket  = require('socket.io'),
		stylus  = require('stylus'),
		nib     = require('nib'),
		routes  = require('./routes')

// set up express app
var app = express()
function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib())
}
// use Jade and get views from '/views' directory
app.set('views', __dirname + '/views')
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
// app.get('/', function(req, res) {
// 	res.render('index',
// 		{title: 'Home'}
// 	)
// })

app.listen(3000, function() {
	console.log('Server up on port 3000')
})