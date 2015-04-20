// Model file for region data

var mongoose = require('mongoose')

var Schema = mongoose.Schema
var RegionSchema = new Schema({
  name: String,
  state: String
})

module.exports = mongoose.model('Region', RegionSchema, 'region')