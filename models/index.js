// used to connect to mongo
var mongoose = require('mongoose'),
    config   = require('./config'),
    dbUrl    = 'mongodb://localhost/onpoint-dev'

mongoose.connect(dbUrl)

var Region = require('./region')
var City = require('./city')
var Point = require('./point')

//clear out old data
Point.remove({}, function(err) {
  if (err) {
    console.log('ERROR deleting old point data.')
  }
})

Point.remove({}, function(err) {
  if (err) {
    console.log('ERROR deleting old point data.')
  }
})

var SightglassCoffee = new Point({
  name: 'Sightglass Coffee',
  address: {
    street: '270 7th St.',
    city: 'San Francisco',
    state: 'California',
    zip: 94103
  },
  cityId: '5537e4824fc92c295cf3ac79',  // city id
  regionId: '5537e1e72fd514f75b2488dc', // region id
  meta: {
    comments: 0,
    photos: 0
  }
})
SightglassCoffee.save(function(err, SightglassCoffee) {
  if (err) throw err
})

var MtDavidsonPark = new Point({
  name: 'Mount Davidson Park',
  address: {
    street: 'Mount Davidson',
    city: 'San Francisco',
    state: 'California',
    zip: 94127
  },
  cityId: '5537e4824fc92c295cf3ac79',  // city id
  regionId: '5537e1e72fd514f75b2488dc', // region id
  meta: {
    comments: 0,
    photos: 0
  }
})
MtDavidsonPark.save(function(err, MtDavidsonPark) {
  if (err) throw err
})