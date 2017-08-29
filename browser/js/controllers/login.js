'use strict';

app.controller('LoginCtrl', function ($scope, Auth, $state) {
  $scope.submitLogin = function(){
    Auth.login($scope.userData)
    .then(function(){
      $state.go('home')
    }, function(){
      $scope.userData = {}
    })
  }

});