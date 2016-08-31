'use strict'

app.controller('LoginCtrl', function($scope, $state, $log, Auth){
	$scope.login = function(user){
		// need to return result of AJAX post to do state transition
		return Auth.login(user)
			.then(function(){
				$state.go('stories');
			})
			.catch(function(){
				$scope.invalidLogin = true;
			})
	}
});
