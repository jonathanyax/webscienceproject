var express  = require('express'),
	passport = require('passport'),
	Account = require('../models/account'),
    mongoose = require('mongoose'),
	mongo	= require('mongodb'),
	router   = express.Router();

var db = mongoose.createConnection('mongodb://localhost/onpoint-dev');
var accounts = db.collection('accounts');
var ObjectId = mongo.ObjectId;

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
      // res.send('{"msg:"No data"}')
	  res.render('error', {error: err, user: req.user});
      return
    }
    // console.log(regions)
    City.find({}, function(err2, cities) {
      if (err) {
        // res.send('{"msg:"No data"}')
		res.render('error', {error: err2, user: req.user});
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
      // res.send('{"msg:"No data"}')
		res.render('error', {error: err, user: req.user});
      return
    }
    // console.log(regions)
    if(regions) {
		City.find({}, function(err2, cities) {
			if(cities) {
				if (err2) {
		        // res.send('{"msg:"No data"}')
				res.render('error', {error: err2, user: req.user});
		        return
		      }
		      // console.log(cities)
		      Region.findOne({name: regionName}, function(err3, selectedRegion) {
		        if (err3) {
		          // res.send('{"msg:"No data"}')
		         res.render('error', {error: err3, user: req.user});
				return
		        }
		        if(selectedRegion) res.render('regions', {title: 'Regions', active: 'regions', regions: regions, cities: cities, selectedRegion: selectedRegion, user: req.user});
				else return res.render('error', {message: "Could not find selected region.", user: req.user});
		      })
			}
			else return res.render('error', {message: "Could not find cities", user: req.user});
	    })
	}
	else {
		return res.render('error', {message: "Could not find region", user: req.user});
	}
  })
})

// define the city route
router.get('/regions/:regionName/:cityName', function(req, res) {
  var regionName = req.params.regionName.replace(/-/g, ' ')
  var cityName = req.params.cityName.replace(/-/g, ' ')
  Region.findOne({name: regionName}, function(err, region) {
    if (err) {
      // res.send('{"msg:"No data"}')
		res.render('error', {error: err, user: req.user});
      return
    }
    if(region) {
		City.findOne({name: cityName}, function(err2, city) {
	      if (err2) {
	        // res.send('{"msg:"No data"}')
			res.render('error', {error: err2, user: req.user});
	        return
	      }
		if (city) {
			// console.log(city)
	      Point.find({cityId: city.id}, function(err3, points) {
	        if (err3) {
				res.render('error', {error: err3, user: req.user});
	          // res.send('{"msg:"No data"}')
	          return
	        }
	        // console.log(points)
	        return res.render('city', {title: cityName, region: region, city: city, points: points, user: req.user})
	      })
		}
		else return res.render('error', {message: "Could not find city", user: req.user});
	    })
	}
	else {
		res.render('error', {message: "Could not find region", user: req.user});
		return;
	}
  })
})

// define the point ID route
router.get('/point/:pointId', function(req, res) {
  Point.findOne({_id: req.params.pointId}, function(err, point) {
    if (err) {
		res.render('error', {error: err, user: req.user});
      // res.send('{"msg:"No data"}')
      return
    }
	// console.log(req.params);    
	// console.log(point)
    if (point) {
		Region.findOne({_id: point.regionId}, function(err2, region) {
	      if (err2) {
			res.render('error', {error: err2, user: req.user});
	        // res.send('{"msg:"No data"}')
	        return
	      }
	      if (region) {
			City.findOne({_id: point.cityId}, function(err3, city) {
		        if (err3) {
					res.render('error', {error: err3, user: req.user});
		          // res.send('{"msg:"No data"}')
		          return
		        }
		        if (city) {
					// See if user has this point in My Points
					var mypoints = req.user.points;
					var haspoint = false;
					if(mypoints.indexOf(req.params.pointId) >= 0) haspoint = true;
		        	res.render('point', {title: point.name, active: 'point', point: point, city: city, region: region, user: req.user, haspoint: haspoint});
		        }
				else {
					res.render('error', {messsage: "Could not find city.", user: req.user});
				}
		      })
	  }
		else res.render('error', {message: "Could not find region.", user: req.user});
	    })
	}
	else {
		res.render('error', {message: "Could not find point.", user: req.user});
		return;
	}
  })
})

// define the search route
router.get('/search', function(req, res) {
	Point.find({}, function(err, points) {
		if (err) return res.render('search', {title: 'Search', active: 'search', user: req.user});
		if (points) return res.render('search', {title: 'Search', active: 'search', user: req.user, points: points});
		else return res.render('search', {title: 'Search', active: 'search', user: req.user});
	})
})

// define the temp search results route
router.get('/search/:searchterm', function(req, res) {
	var searchterm = req.params.searchterm;
	Point.find({"name": new RegExp(searchterm, 'i')}, function(err, points) {
		if (err) return res.render('search_results', {message: "No search results for: " + req.params.searchterm, user: req.user});
		if (! points.length == 0) {
			res.render('search_results', {title: 'Search Results', active: 'search', user: req.user, searchterm: searchterm, points: points});
		}
		else if (points.length == 0) {
			// Try searching the city name!
			Point.find({"address.city": new RegExp(searchterm, 'i')}, function (err, points) {
				if (err) return res.render('search_results', {message: "No search results for: " + req.params.searchterm, user: req.user});
				if (!points.length == 0) return res.render('search_results', {title: 'Search Results', active: 'search', user: req.user, searchterm: searchterm, points: points});
				else return res.render('search_results', {message: "No search results for: " + searchterm, user: req.user});
			})	
		}
		else return res.render('search_results', {message: "No search results for: " + searchterm, user: req.user});
	}
)})

router.post('/search', function(req, res) {
	var searchterm = req.body.searchterm;
	if (searchterm) res.redirect('/search/' + searchterm);
	else return res.render('search_results', {user: req.user});	
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
	if (req.user) res.render('settings', {title: 'Settings', active: 'settings', user: req.user});
	else res.redirect('/signin');
})

// define the profile page route
router.get('/profile', function(req, res) {
	if (req.user) res.render('profile', {title: 'Profile', active: 'profile', user: req.user});
	else res.redirect('/signin');
})

// Register Handling
// Need more error checking for firstname/lastname/email-validation
// For register, you can send it vars to auto-fill given info after error like username-taken
router.post('/register', function(req, res) {
	Account.register(new Account({username: req.body.username, email: req.body.email, fullName: req.body.fullName}), req.body.password, function (err, account) {
		if (err) {
			if (!req.body.username) return res.render('signin', {info: "Please enter a username!"});
			else if (!req.body.password) return res.render('signin', {join_username: req.body.username, info: "Please enter a password!"});
			else return res.render('signin', {join_username: req.body.username, info:"Sorry! That username is taken."});
		}
		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
})

router.get('/signin', function(req, res) {
	res.render('signin', {info: req.flash('error'), title: 'Sign In'});
})

router.post('/signin',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/signin',
                                   failureFlash: true })
)

// FB Redirection
router.get('/auth/facebook', passport.authenticate('facebook', {scope:['email']}));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
	scope: ['email'],
	successRedirect : '/',
	failureRedirect: '/signin'}),
	function(req,res) {
		res.redirect('/');
});

router.get('/logout', function(req, res) {
	req.logout();
	// res.redirect('/');
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