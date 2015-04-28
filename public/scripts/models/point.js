// Model file for point data

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
  images: {
    mainImage: String,
    userImages: [{
      type: String
    }]
  },
  comments: [{
    message: String,
    userId: String,
    userName: String,
    userImage: String
  }]
})

module.exports = mongoose.model('Point', PointSchema, 'point')