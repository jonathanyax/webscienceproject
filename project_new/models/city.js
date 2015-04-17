// Model file for region data

var mongoose = require('mongoose')

var Schema = mongoose.Schema
var CitySchema = new Schema({
  name: String,
  region: String // region id
})

module.exports = mongoose.model('City', CitySchema, 'city')