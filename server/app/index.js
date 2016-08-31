'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

app.use(session({
	secret: 'KinisKing'
}));
app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(function (req, res, next) {
	next();
});
app.use(passport.initialize());
app.use(passport.session());

// Google authentication and login
app.get('/auth/google', passport.authenticate('google', { scope : 'email' }));

// handle the callback after Google has authenticated the user
app.get('/auth/google/callback',
	passport.authenticate('google', {
		successRedirect : '/', // or wherever
		failureRedirect : '/' // or wherever
	})
);

// passport stuff
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id)
		.then(function (user) {
			done(null, user);
		})
		.catch(done);
});

passport.use(
	new GoogleStrategy({
			clientID: '299872649527-f6036sfj7bq8h4jl3jrjrklaps0ni5pt.apps.googleusercontent.com',
			clientSecret: 'xcK3ACUYNeYDQcyHdQVM7Nfo',
			callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
		},
		// Google will send back the token and profile
		function (token, refreshToken, profile, done) {
			// the callback will pass back user profile information and each service (Facebook, Twitter, and Google) will pass it back a different way. Passport standardizes the information that comes back in its profile object.
			/*
			 --- fill this part in ---
			 */
			var info = {
				name: profile.displayName,
				email: profile.emails[0].value,
				photo: profile.photos ? profile.photos[0].value : undefined
			};
			User.findOrCreate({
				where: {googleId: profile.id},
				defaults: info
			})
				.spread(function (user) {
					console.log("Created user")
					done(null, user);
				})
				.catch(done);


		})
);



app.use('/api', function (req, res, next) {
	if (!req.session.counter) req.session.counter = 0;
	console.log('counter', ++req.session.counter);
	next();
});

app.use('/api', require('../api/api.router'));


// route to handle login ajax request from login page
app.post('/login', function (req, res, next) {
  User.findOne({
    where: req.body
  })
  .then(function (user) {
  	console.log("GOT USER: ", user);
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
	    console.log("USER ID: ", user.id);
      res.send({id: user.id, email: user.email});
    }
  })
  .catch(next);
});

// route to handle signup ajax request from signup page
app.post('/signup', function (req, res, next) {
	User.create({
		email: req.body.email,
		password: req.body.password
	})
		.then(function (user) {
			if (!user) {
				res.sendStatus(401);
			} else {
				req.session.userId = user.id;
				res.sendStatus(204);
			}
		})
		.catch(next);
});

app.get('/auth/me', function(req, res, next){
  User.findById(req.session.userId)
  .then(function(foundUser){
      res.send(foundUser);
  });
});

app.get('/logout', function(req, res, next){
  req.session.userId = null;
	req.session.destroy();
	// sends response back to front end to resolve ajax get request - redirects to 'home' state via UI-ROUTER
	res.sendStatus(204);
});

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));
app.use(require('./error.middleware'));

module.exports = app;
