'use strict'

app.controller('LoginCtrl', function($scope, $http, $state, $log){

  $scope.submitLogin = function(user){

    $http.post('/login', user)
    .then(function(foundUser){

      // if this fails, will defer automatically to .catch!
      if (foundUser) {
        $state.go('stories');
      }
    }).catch(function(){
        $scope.invalidUser = true;
    });
  };


});
