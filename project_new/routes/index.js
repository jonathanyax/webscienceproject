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

// define the search route
router.get('/search', function(req, res) {
  res.render('search', {title: 'Search'})
})

// define the search route
router.get('/point', function(req, res) {
  res.render('point', {title: 'Point'})
})


module.exports = router