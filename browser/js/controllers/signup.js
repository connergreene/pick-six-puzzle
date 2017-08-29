'use strict';

app.controller('SignupCtrl', function ($scope, UserFactory, $state) {
  $scope.signup = function(){
    UserFactory.signup($scope.userData)
    .then(function(){
      $state.go('home')
    }, function(){
      $scope.userData = {}
    })
  }

});