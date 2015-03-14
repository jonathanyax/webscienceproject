var express = require('express'),
    router  = express.Router()

// define the home page route
router.get('/', function(req, res) {
  res.render('index', {title: 'Home'})
})

// define the regions route
router.get('/regions', function(req, res) {
  res.render('regions', {title: 'Regions'})
})

module.exports = router