'use strict'

app.factory('Auth', function($http, $log){

	var currentUser = null;

	var Auth = {};
	Auth.login = function(user){
		return $http.post('/login', user)
			.then(function(res){
				 currentUser = {id: res.data.id, email: res.data.email}
				 console.log("CURRENT USER SET: ", currentUser)
				 return res.data;
			})
			.catch($log.error)
	};

	Auth.signup = function(user){
		return $http.post('/signup', user)
			.then(function(res){
				return res.data;
			})
	};

	Auth.getCurrentUser = function(){
		return currentUser;
	}
	return Auth;


})