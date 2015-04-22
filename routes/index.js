var express  = require('express'),
	passport = require('passport'),
	Account = require('../models/account'),
    mongoose = require('mongoose')
    router   = express.Router(),

// define the home page route
router.get('/', function(req, res) {
  res.render('index', {title: 'Home', active: 'home', user: req.user})
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
      res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, user: req.user})
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
        res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, selectedRegion: selectedRegion, user: req.user})
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
        return res.render('city', {title: cityName, region: region, city: city, points: points, user: req.user})
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
        res.render('point', {title: point.name, active: 'point', point: point, city: city, region: region, user: req.user})
      })
    })
  })
})

// define the search route
router.get('/search', function(req, res) {
  res.render('search', {title: 'Search', active: 'search', user: req.user})
})

// define the temp search results route
router.get('/search_results', function(req, res) {
  res.render('search_results', {title: 'Search Results', active: 'search', user: req.user})
})

// define the discover route
router.get('/discover', function(req, res) {
	res.render('discover', {title: 'Discover', active: 'discover', user: req.user})
})

// define the help page route
router.get('/help', function(req, res) {
	res.render('help', {title: 'Help Center', active: 'help', user: req.user})
})

// define the settings page route
router.get('/settings', function(req, res) {
	if(req.user) res.render('settings', {title: 'Settings', active: 'settings', user: req.user})
	else res.redirect('/signin');
})

// define the profile page route
router.get('/profile', function(req, res) {
	res.render('profile', {title: 'Profile', active: 'profile', user: req.user})
})

// Register Handling
// Need more error checking for firstname/lastname/email-validation
// For register, you can send it vars to auto-fill given info after error like username-taken
router.post('/register', function(req, res) {
	Account.register(new Account({username: req.body.username, email: req.body.email, firstName: req.body.firstName, lastName: req.body.lastName}), req.body.password, function (err, account) {
		if (err) {
			if (!req.body.username) return res.render('signin', {info: "Please enter a username!"});
			else if (!req.body.password) return res.render('signin', {user: req.body.username, info: "Please enter a password!"});
			else return res.render('signin', {user: req.body.username, info:"Sorry! That username is taken."});
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
})

router.get('/signin', function(req, res) {
	res.render('signin', {info: req.flash('error'), user : req.body.username});
})

router.post('/signin',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/signin',
                                   failureFlash: true })
)

router.get('/logout', function(req, res) {
	req.logout();
	// res.redirect('/');
	return res.render('index', {title: 'Home', active: 'home', user: null})
})


module.exports = router