'use strict';

app.controller('StoryListCtrl', function ($scope, stories, Story, users, Auth) {
  $scope.stories = stories;
  $scope.users = users;
	// $scope.getCurrentUser = Auth.getCurrentUser;
	$scope.isLoggedIn = Auth.getCurrentUser();
  $scope.currentlyLoggedIn = Auth.getLoggedInUser();
  if($scope.currentlyLoggedIn)
  $scope.newStory = new Story();
  console.log("Auth.getCurrentUser : ", Auth.getCurrentUser());
  $scope.removeStory = function (story) {
    story.destroy()
    .then(function () {
      var idx = $scope.stories.indexOf(story);
      $scope.stories.splice(idx, 1);
    });
  };

  $scope.addStory = function () {
    $scope.newStory.save()
    .then(function (created) {
      // created.author = $scope.newStory.author;
      $scope.newStory = new Story();
      $scope.stories.unshift(created);
    });
  };
});
