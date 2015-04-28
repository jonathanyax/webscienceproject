/*
 * Module dependencies
 */
  var express      = require('express'),
  		jade     	   = require('jade'),
  		stylus   	   = require('stylus'),
  		nib      	   = require('nib'),
  		path	 	     = require('path'),
  		favicon	 	   = require('serve-favicon'),
  		logger	 	   = require('morgan'),
  		cookieParser = require('cookie-parser'),
  		bodyParser	 = require('body-parser'),
  		mongoose	   = require('mongoose'),
      session   = require('express-session'),
      MongoStore  = require('connect-mongo')(session),
  		passport	   = require('passport'),
  		flash		     = require('connect-flash'),
  		models		   = require('./models'),
  		routes		   = require('./routes'),
  		config		   = require('./oauth.js'),
  		FacebookStrategy = require('passport-facebook').Strategy,
  		LocalStrategy    = require('passport-local').Strategy
		
// set up express app
var app = express();

function compile(str, path) {
	return stylus(str)
		.set('filename', path)
		.use(nib())
}

// set default node environment variables to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

// use Jade and get views from '/views' directory
app.set('views', __dirname + '/views')
app.set('port', (process.env.PORT || 5000))
app.set('view engine', 'jade')

// middleware to compile .styl files to CSS
app.use(stylus.middleware(
	{ src: __dirname + '/public',
	  compile: compile
	}
))

// static files in '/public' directory
app.use(express.static(__dirname + '/public'))
app.use('/public/scripts', express.static(__dirname + '/public/scripts'))

// favicon
app.use(favicon(__dirname + "/public/images/favicon.ico"));

// passport stuff
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use((session)({
	secret: 'secret cat',
	resave: false,
	maxAge : new Date(Date.now() + 3600000),
	saveUninitialized: false,
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());
app.use('/', routes)

// Mongoose Connection
mongoose.createConnection('mongodb://localhost/onpoint-dev');

// Passport configuration
var Account = require('./models/account');
// Local Authentication Strategy
passport.use(new LocalStrategy(Account.authenticate()));
// FB Auth Strategy
passport.use(new FacebookStrategy({
	clientID: config.facebook.clientID,
	clientSecret: config.facebook.clientSecret,
	callbackURL: config.facebook.callbackURL,
	profileFields: ['id', 'displayName', 'emails', 'photos']
},
function (accessToken, refreshToken, profile, done) {
	process.nextTick(function() {
		Account.findOne( {'oauthID' : profile.id}, function(err, user) {
			if (err) return done(err);
			if (user) return done(null, user);
			else {
				var newAccount = new Account();
				newAccount.oauthID = profile.id;
				newAccount.fullName = profile.displayName;
				newAccount.email = profile.emails[0].value;
				newAccount.picture = "https://graph.facebook.com/" + profile.id + "/picture?width=250&height=250";
				
				newAccount.save(function(err) {
					if (err) throw err;
					return done(null, newAccount);
				});
			}
		});
	});
}
));

// passport.serializeUser(Account.serializeUser());
// passport.deserializeUser(Account.deserializeUser());
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


// Passport Port
app.listen(1337);

// app.listen(app.get('port'), function() {
//   console.log("OnPoint is running on:" + app.get('port'))
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
