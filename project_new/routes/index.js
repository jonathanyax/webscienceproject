var express = require('express'),
    router  = express.Router()

// define the home page route
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', active: 'home'})
})

// define the regions route
router.get('/regions', function(req, res) {
  res.render('regions', {title: 'Regions', active: 'regions'})
})

// define the search route
router.get('/search', function(req, res) {
  res.render('search', {title: 'Search', active: 'search'})
})

// define the search route
router.get('/point', function(req, res) {
  res.render('point', {title: 'Point', active: 'point'})
})

// define the discover route
router.get('/discover', function(req, res) {
	res.render('discover', {title: 'Discover', active: 'discover'})
})


module.exports = router