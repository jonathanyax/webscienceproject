var express		= require('express'),
	passport	= require('passport'),
	Account		= require('../models/account'),
    mongoose	= require('mongoose'),
	mongo		= require('mongodb'),
	async		= require('async'),
	router		= express.Router(),
	multer		= require('multer'),
	uploadDone	= false;

var db = mongoose.createConnection('mongodb://localhost/onpoint-dev');
var accounts = db.collection('accounts');
var ObjectId = mongo.ObjectId;

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
						var my_points = {}
						for (point in points) {
							var currPointId = points[point].id
							if (req.user && req.user.points.indexOf(currPointId) >= 0) {
								my_points[currPointId] = true
							} else {
								my_points[currPointId] = false
							}
						}
						// render city page even if there are no points
						return res.render('city', {title: cityName, region: region, city: city, points: points, user: req.user, mypoints: my_points})
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

// Define Point ID Route
router.get('/point/:pointId', function(req, res) {
	var point_id = req.params.pointId;
	Point.findOne({_id : point_id}, function(err, point) {
		if (err) {return res.render('error', {error: err, user: req.user});}
			if(point) {
				Region.findOne({_id: point.regionId}, function(err2, region) {
					if(err2) {return res.render('error', {error: err2, user: req.user});}
					if (region) {
						City.findOne({_id : point.cityId}, function(err3, city) {
							if (err3) return res.render('error', {error: err3, user: req.user});
							if (city) {
								// See if user has point to display
								var haspoint = false;
								if (req.user && req.user.points.indexOf(point_id) >=0) {haspoint = true;}
								res.render('point', {title: point.name, active: 'point', point: point, city: city, region:region, user: req.user, haspoint: haspoint});
							}
							else {return res.render ('error', {message: "Could not find city.", user: req.user});}
						})
					}
					else {return res.render('error', {message: "Could not find point.", user: req.user});}
				})
			}
	})
})

// add new point
router.post('/point', function(req, res) {
	var point, 
			imageFileName,
			comment,
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
		imageFileName = req.files.point_image.name
	}

	// get point info from google
	geocoder.geocode(fullAddress, function(err, geoRes) {
		if (err) {
			res.render('error', {error: err})
			return
		}
		var lat     = geoRes[0].latitude,
				lon     = geoRes[0].longitude,
				street  = geoRes[0].streetNumber + ' ' + geoRes[0].streetName,
				city    = geoRes[0].city,
				state   = geoRes[0].stateCode,
				zip     = geoRes[0].zipcode,
				placeId = geoRes[0].extra.googlePlaceId

		if (pointInfo.point_comment == undefined) {
			comment = null
		} else {
			comment = {
							    message: pointInfo.point_comment,
							    userId: user._id,
							    userName: user.fullName,
							    userImage: user.picture
							  }
		}

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
					googlePlaceId: placeId,
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
					comments: []
				})
				if (comment !== null) {
					point.comments = [comment]
				}
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
	}).limit(5)
})

// define the temp search results route
router.get('/search/:searchterm', function(req, res) {
	var searchterm = req.params.searchterm
	Point.find({"name": new RegExp(searchterm, 'i')}, function(err, points) {
		if (err) return res.render('search_results', {message: "No search results for: " + req.params.searchterm, user: req.user})
		if (!points.length == 0) {
			res.render('search_results', {title: 'Search Results', active: 'search', user: req.user, searchterm: searchterm, points: points})
		}
		else if (points.length == 0) {
			// Try searching the city name!
			Point.find({"address.city": new RegExp(searchterm, 'i')}, function (err, points) {
				if (err) return res.render('search_results', {message: "No search results for: " + req.params.searchterm, user: req.user})
				if (!points.length == 0) return res.render('search_results', {title: 'Search Results', active: 'search', user: req.user, searchterm: searchterm, points: points})
				else return res.render('search_results', {message: "No search results for: " + searchterm, user: req.user})
			})	
		} else {
			return res.render('search_results', {message: "No search results for: " + searchterm, user: req.user})
		}
	}
)})

router.post('/search', function(req, res) {
	var searchterm = req.body.searchterm
	if (searchterm) res.redirect('/search/' + searchterm)
	else return res.render('search_results', {user: req.user})
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
	if (req.user) {
		var mypoints = req.user.points;
		var final_points = [];
		var points_to_check = [];
		
		for (each in mypoints) {points_to_check.push(each);}
		
		var queue = [
			function(callback) {callback(null, points_to_check, 0)}
		];
		
		// for every dynamic query
		var callbackfunc = function (prev, current, callback) {
			Point.find({_id: ObjectId(mypoints[current])}, function(err, res) {
				if (err) console.log(err);
				else {
					final_points.push(res);
					callback(null, res, current+1);
				}
			})
		}
		
		for (each in points_to_check) {queue.push(callbackfunc);}
		
		async.waterfall(queue, function (err, finalres) {
			res.render('profile', {title: 'Profile', active: 'profile', user: req.user, points: final_points});
		})
		
		// return res.render('profile', {title: 'Profile', active: 'profile', user: req.user, points: final_points});
	}
	else res.redirect('/signin');
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

// Logout Route
router.get('/logout', function(req, res) {
	req.logout();
	return res.render('index', {title: 'Home', active: 'home', user: null})
})

// Point Favoriting
router.get('/favorite/:pointID', function(req, res) {
	if (!req.user) return res.redirect('/signin');
	else {
		var mypoints = req.user.points;
		var account = accounts.find({_id: ObjectId(req.user._id)}, function(err, account) {
			if (err) res.redirect('/point/' + req.params.pointID);
			else {
				// If we don't have the point, add it as a favorite
				if(mypoints.indexOf(req.params.pointID) < 0) {
					mypoints.push(req.params.pointID);			
					accounts.update( {_id: ObjectId(req.user._id)}, { $set : {points: mypoints} });
					return res.redirect('/point/' + req.params.pointID);
				}
				// Otherwise, remove the point
				else {
					var index_remove = mypoints.indexOf(req.params.pointID);
					if (index_remove > -1) mypoints.splice(index_remove, 1);
					accounts.update({_id: ObjectId(req.user._id)}, {$set : {points: mypoints}}); 
					return res.redirect('/point/' + req.params.pointID);
				}
			}
		});
	}
});


module.exports = router