var express    = require('express'),
	  passport   = require('passport'),
	  Account    = require('../models/account'),
		mongoose   = require('mongoose'),
		router     = express.Router(),
		multer     = require('multer'),
		uploadDone = false

// define the home page route
router.all('/', function(req, res) {
	res.render('index', {title: 'Home', active: 'home', user: req.user})
})

// middleware to configure multer
router.use(multer({dest: './public/images/uploads/',
  rename: function(fieldname, filename) {
    return filename + Date.now()
  },
  onFileUploadStart: function(file) {
    console.log(file.originalname + ' is starting...')
  },
  onFileUploadComplete: function(file) {
    console.log(file.fieldname + ' uploaded to ' + file.path)
    uploadDone = true
  }
}))

// define the regions route
var Region = mongoose.model('Region')
var City = mongoose.model('City')
var Point = mongoose.model('Point')

// define region route
router.get('/regions', function(req, res) {
	Region.find({}, function(err, regions) {
		if (err) {
		res.render('error', {error: err})
			return
		}
		City.find({}, function(err2, cities) {
			if (err) {
		res.render('error', {error: err2})
				return
			}
			res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, user: req.user})
		})
	})
})

// define region route with region selected
router.get('/regions/:regionName', function(req, res) {
	var regionName = req.params.regionName.replace(/-/g, ' ')
	Region.find({}, function(err, regions) {
		if (err) {
			res.render('error', {error: err})
			return
		}
		if(regions) {
			City.find({}, function(err2, cities) {
				if(cities) {
					if (err2) {
						res.render('error', {error: err2})
						return
					}
					Region.findOne({name: regionName}, function(err3, selectedRegion) {
						if (err3) {
							res.render('error', {error: err3})
							return
						}
						if(selectedRegion) {
							res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, selectedRegion: selectedRegion, user: req.user})
						} else {
							return res.render('error', {message: "Could not find selected region."})
						}
					})
				} else { // if (!cities)
					return res.render('error', {message: "Could not find cities"})
				}
			}) // end City.find()
		} else { // if (!regions)
			return res.render('error', {message: "Could not find region"});
		}
	}) // end Region.find()
})

// define the city route
router.get('/regions/:regionName/:cityName', function(req, res) {
	var regionName = req.params.regionName.replace(/-/g, ' ')
	var cityName = req.params.cityName.replace(/-/g, ' ')

	Region.findOne({name: regionName}, function(err, region) {
		if (err) {
			res.render('error', {error: err});
			return
		}
		if(region) {
			City.findOne({name: cityName}, function(err2, city) {
				if (err2) {
					res.render('error', {error: err2})
					return
				}
				if (city) {
					Point.find({cityId: city.id}, function(err3, points) {
						if (err3) {
							res.render('error', {error: err3})
							return
						}
						// render city page even if there are no points
						return res.render('city', {title: cityName, region: region, city: city, points: points, user: req.user})
					})
				} else {
					return res.render('error', {message: "Could not find city"})
				}
			}) // end City.findOne()
		} else { // if (!region)
			res.render('error', {message: "Could not find region"})
			return
		}
	}) // end Region.findOne()
})

// define the point ID route
router.get('/point/:pointId', function(req, res) {
	Point.findOne({_id: req.params.pointId}, function(err, point) {
		if (err) {
			res.render('error', {error: err});
			return
		}
		if (point) {
			Region.findOne({_id: point.regionId}, function(err2, region) {
				if (err2) {
					res.render('error', {error: err2})
					return
				}
				if (region) {
					City.findOne({_id: point.cityId}, function(err3, city) {
						if (err3) {
							res.render('error', {error: err3})
							return
						}
						if (city) {
							res.render('point', {title: point.name, active: 'point', point: point, city: city, region: region, user: req.user})
						} else {
							res.render('error', {messsage: "Could not find city."})
						}
					}) // end City.findOne()
				} else { // if (!region)
					res.render('error', {message: "Could not find region."})
				}
			}) // end Region.findOne()
		} else { // if (!point)
			res.render('error', {message: "Could not find point."})
			return
		}
	}) // end Point.findOne()
})

// add new point
router.post('/point', function(req, res) {
	var point, 
			imageFileName,
			pointInfo        = req.body,
			goecoderProvider = 'google',
			httpAdapter      = 'https',
			user             = req.user

	var extra = {
		formatter: null
	}

	// create geocoder
	var geocoder = require('node-geocoder')(goecoderProvider, httpAdapter, extra)

	// full point address
	var fullAddress = pointInfo.point_name + ' ' + pointInfo.point_address + ' ' + pointInfo.point_city + ' ' + pointInfo.point_state;

	if (uploadDone == true) {
		console.log('uploaded!!!!!')
		console.log(req.files.point_image.name)
		imageFileName = req.files.point_image.name
	}

	// get point info from google
	geocoder.geocode(fullAddress, function(err, geoRes) {
		if (err) {
			res.render('error', {error: err})
			return
		}
		var lat    = geoRes[0].latitude,
				lon    = geoRes[0].longitude,
				street = geoRes[0].streetNumber + ' ' + geoRes[0].streetName,
				city   = geoRes[0].city,
				state  = geoRes[0].stateCode,
				zip    = geoRes[0].zipcode

		City.findOne({name: city}, function(err2, pointCity) {
			if (err2) {
				res.render('error', {error: err2})
				return
			}

			if (pointCity) {
				point = new Point({
					name: pointInfo.point_name,
					address: {
						street: street,
						city: city,
						state: state,
						zip: zip
					},
					cityId:  pointCity.id,  // city id
					regionId: pointCity.region, // region id
					coordinates: {
						latitude: lat,
						longitude: lon
					},
					images: {
						mainImage: imageFileName,
						userImages: [imageFileName]
					},
					comments: [{
				    message: pointInfo.point_comment,
				    userId: user._id,
				    userName: user.fullName,
				    userImage: user.picture
				  }]
				})
				point.save(function(err3, point) {
					if (err3) res.render('error', {error: err3})
					return res.redirect('/point/' + point.id)
				})
			} else {
				return res.render('error', {message: "Could not find city"})
			}
		})
	})

})

// define the search route
router.get('/search', function(req, res) {
	Point.find({}, function(err, points) {
		if (err) return res.render('search', {title: 'Search', active: 'search', user: req.user})
		if (points) return res.render('search', {title: 'Search', active: 'search', user: req.user, points: points})
		else return res.render('search', {title: 'Search', active: 'search', user: req.user})
	})
})

// define the temp search results route
router.get('/search/:searchterm', function(req, res) {
	var searchterm = req.params.searchterm
	Point.find({"name": new RegExp(searchterm, 'i')}, function(err, points) {
		if (err) return res.render('error', {message: "No search results for: " + req.params.searchterm});
		if (points) {
			res.render('search_results', {title: 'Search Results', active: 'search', user: req.user, searchterm: searchterm, points: points})
		} else {
			return res.render('error', {message: "Could not search for: " + searchterm})
		}
	})
})

router.post('/search', function(req, res) {
	var searchterm = req.body.searchterm
	if (searchterm) res.redirect('/search/' + searchterm)
	else return res.render('error', {message: searchterm})
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
	if (req.user) res.render('settings', {title: 'Settings', active: 'settings', user: req.user})
	else res.redirect('/signin')
})

// define the profile page route
router.get('/profile', function(req, res) {
	if (req.user) res.render('profile', {title: 'Profile', active: 'profile', user: req.user})
	else res.redirect('/signin')
})

// Register Handling
// Need more error checking for firstname/lastname/email-validation
// For register, you can send it vars to auto-fill given info after error like username-taken
router.post('/register', function(req, res) {
	var username = req.body.username,
		  password = req.body.password,
	    email    = req.body.email,
	    fullName = req.body.fullName

	Account.register(new Account({username: username, email: email, fullName: fullName}), password, function (err, account) {
		if (err) {
			if (!username) return res.render('signin', {info: "Please enter a username!"})
			else if (!password) return res.render('signin', {join_username: username, info: "Please enter a password!"})
			else return res.render('signin', {join_username: username, info:"Sorry! That username is taken."})
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/')
		})
	})
})

router.get('/signin', function(req, res) {
	res.render('signin', {info: req.flash('error'), title: 'Sign In'})
})

router.post('/signin',
	passport.authenticate('local', { successRedirect: '/',
																	 failureRedirect: '/signin',
																	 failureFlash: true })
)

// FB Redirection
router.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']}))
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		scope: ['email'],
		successRedirect : '/',
		failureRedirect: '/signin'}
	), function(req,res) {
		res.redirect('/')
})

router.get('/logout', function(req, res) {
	req.logout();
	// res.redirect('/');
	return res.render('index', {title: 'Home', active: 'home', user: null})
})


module.exports = router