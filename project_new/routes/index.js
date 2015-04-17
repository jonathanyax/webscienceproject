var express  = require('express'),
    router   = express.Router(),
    mongoose = require('mongoose')

// define the home page route
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', active: 'home'})
})

// define the regions route
var Region = mongoose.model('Region')
var City = mongoose.model('City')
var Point = mongoose.model('Point')

// define region route
router.get('/regions', function(req, res) {
  Region.find({}, function(err, regions) {
    if (err) {
      res.send('{"msg:"No data"}')
      return
    }
    // console.log(regions)
    City.find({}, function(err2, cities) {
      if (err) {
        res.send('{"msg:"No data"}')
        return
      }
      // console.log(cities)
      res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities})
    })
  })
})

// define region route with region selected
router.get('/regions/:regionName', function(req, res) {
  var regionName = req.params.regionName.replace(/-/g, ' ')
  Region.find({}, function(err, regions) {
    if (err) {
      res.send('{"msg:"No data"}')
      return
    }
    // console.log(regions)
    City.find({}, function(err2, cities) {
      if (err2) {
        res.send('{"msg:"No data"}')
        return
      }
      // console.log(cities)
      Region.findOne({name: regionName}, function(err3, selectedRegion) {
        if (err3) {
          res.send('{"msg:"No data"}')
          return
        }
        res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, selectedRegion: selectedRegion})
      })
    })
  })
})

// define the city route
router.get('/regions/:regionName/:cityName', function(req, res) {
  var regionName = req.params.regionName.replace(/-/g, ' ')
  var cityName = req.params.cityName.replace(/-/g, ' ')
  Region.findOne({name: regionName}, function(err, region) {
    if (err) {
      res.send('{"msg:"No data"}')
      return
    }
    City.findOne({name: cityName}, function(err2, city) {
      if (err2) {
        res.send('{"msg:"No data"}')
        return
      }
      // console.log(city)
      Point.find({cityId: city.id}, function(err3, points) {
        if (err3) {
          res.send('{"msg:"No data"}')
          return
        }
        // console.log(points)
        return res.render('city', {title: cityName, region: region, city: city, points: points})
      })
    })
  })
})

// define the search route
router.get('/point/:pointId', function(req, res) {
  Point.findOne({_id: req.params.pointId}, function(err, point) {
    if (err) {
      res.send('{"msg:"No data"}')
      return
    }
    // console.log(point)
    Region.findOne({_id: point.regionId}, function(err2, region) {
      if (err2) {
        res.send('{"msg:"No data"}')
        return
      }
      City.findOne({_id: point.cityId}, function(err3, city) {
        if (err3) {
          res.send('{"msg:"No data"}')
          return
        }
        res.render('point', {title: point.name, active: 'point', point: point, city: city, region: region})
      })
    })
  })
})

// define the search route
router.get('/search', function(req, res) {
  res.render('search', {title: 'Search', active: 'search'})
})

// define the temp search results route
router.get('/search_results', function(req, res) {
  res.render('search_results', {title: 'Search Results', active: 'search'})
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