'use strict';

app.controller('SignupCtrl', function ($scope, UserFactory, $state) {
  $scope.checkPassword = '';
  $scope.passwordError = false;
  $scope.signup = function(){
  	if($scope.checkPassword === $scope.userData.password){
	    UserFactory.signup($scope.userData)
	    .then(function(){
	      $state.go('home')
	    }, function(){
	      $scope.userData = {}
	    })
	}
	else{
		$scope.passwordError = true;
	}
  }

});