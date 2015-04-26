// used to connect to mongo
var mongoose = require('mongoose'),
    config   = require('./config'),
    dbUrl    = 'mongodb://localhost/onpoint-dev'

mongoose.connect(dbUrl)

var Region = require('./region')
var City = require('./city')
var Point = require('./point')
