'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

app.use(session({
	secret: 'KinisKing'
}))
app.use(require('./logging.middleware'));

app.use(require('./request-state.middleware'));

app.use(require('./statics.middleware'));

app.use(function (req, res, next) {
	console.log('session', req.session);
	next();
});

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
    if (!user) {
      res.sendStatus(401);
    } else {
      req.session.userId = user.id;
      res.sendStatus(204);
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


var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'public', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./error.middleware'));

module.exports = app;
