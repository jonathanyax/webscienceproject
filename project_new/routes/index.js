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

// define the temp search results route
router.get('/search_results', function(req, res) {
  res.render('search_results', {title: 'Search Results', active: 'search'})
})

// define the search route
router.get('/point', function(req, res) {
  res.render('point', {title: 'Point', active: 'point'})
})

// define the discover route
router.get('/discover', function(req, res) {
	res.render('discover', {title: 'Discover', active: 'discover'})
})

// define the help page route
router.get('/help', function(req, res) {
	res.render('help', {title: 'Help Center', active: 'help'})
})

// define the settings page route
router.get('/settings', function(req, res) {
	res.render('settings', {title: 'Settings', active: 'settings'})
})

// define the profile page route
router.get('/profile', function(req, res) {
	res.render('profile', {title: 'Profile', active: 'profile'})
})

// define the sign-in page route
router.get('/signin', function(req, res) {
	res.render('signin', {title: 'Sign In'})
})

module.exports = router