'use strict'

app.factory('Auth', function($http){

	var Auth = {};
	Auth.login = function(user){
		return $http.post('/login', user)
			.then(function(res){
				 return res.data;
			})
	};

	Auth.signup = function(user){
		return $http.post('/signup', user)
			.then(function(res){
				return res.data;
			})
	};
	return Auth;

})