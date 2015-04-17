// used to connect to mongo
var mongoose = require('mongoose'),
    config   = require('./config'),
    dbUrl    = 'mongodb://localhost/onpoint-dev'

mongoose.connect(dbUrl)

exports.Region = require('./region')
exports.City = require('./city')
exports.Point = require('./point')