'use strict';

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: '/browser/app/login/login.html',
    controller: 'LoginCtrl'
  });

	$urlRouterProvider.when('/auth/:provider', function(){
		window.location.reload();
	})
});
