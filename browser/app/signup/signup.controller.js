'use strict'

app.controller('SignupCtrl', function ($scope, $state, Auth) {

	$scope.signup = function(user){
		return Auth.signup(user)
			.then(function(){
				$state.go('stories');
			})
			.catch(function(){
				$scope.invalidSignUp = true;
			})
	}
});