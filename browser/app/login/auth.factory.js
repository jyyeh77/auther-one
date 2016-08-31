'use strict';

app.factory('Auth', function($http, $log){
	var Auth = {};
	var currentUser = null;
	var loggedInUser;

	if (!loggedInUser) {
		console.log('begin authMe function');
		$http.get('/auth/me')
		.then(function(user){
			console.log("running authMe function");
			currentUser = user.data;
			console.log('currentuser: ', currentUser);
			loggedInUser = true;
		});
	}

	Auth.login = function(user){
		return $http.post('/login', user)
			.then(function(res){
				 currentUser = {id: res.data.id, email: res.data.email};
				 console.log("CURRENT USER SET: ", currentUser);
				 return res.data;
			})
			.catch($log.error);
	};

	Auth.signup = function(user){
		return $http.post('/signup', user)
			.then(function(res){
				return res.data;
			});
	};

	Auth.getLoggedInUser = function(){
		return loggedInUser;
	}

	Auth.getCurrentUser = function(){
		return currentUser;
	};

	return Auth;
});
