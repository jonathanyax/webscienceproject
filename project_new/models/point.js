// Model file for region data

var mongoose = require('mongoose')

var Schema = mongoose.Schema
var PointSchema = new Schema({
  name: String,
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  cityId: String,  // city id
  regionId: String, // region id
  meta: {
    comments: {type: Number, default: 0, min: 0},
    photos: {type: Number, default: 0, min: 0}
  }
})

module.exports = mongoose.model('Point', PointSchema, 'point')