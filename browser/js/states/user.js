'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('user', {
		url: '/users/:id',
		templateUrl: 'browser/js/templates/profile.html',
		controller: function($scope, $state, user, pickSixes, spellingBees, PickSixFactory, SpellingBeeFactory){
            $scope.user = user;
            $scope.pickSixes = pickSixes;
            $scope.spellingBees = spellingBees;

            $scope.openPickSixDelete = function(pickSix) {
                $scope.showDeletePickSix = true;
                $scope.pickSixToDelete = pickSix;
            };

            $scope.cancelPickSix = function() {
                $scope.showDeletePickSix = false;
            };

            $scope.deletePickSix = function(){
                PickSixFactory.destroy($scope.pickSixToDelete)
                .then(function(){
                    $scope.cancelPickSix();  
                })
                .then(function(){
                    $state.reload();
                });
            };

            $scope.openSpellingBeeDelete = function(spellingBee) {
                $scope.showDeleteSpellingBee = true;
                $scope.spellingBeeToDelete = spellingBee;
            };

            $scope.cancelSpellingBee = function() {
                $scope.showDeleteSpellingBee = false;
            };

            $scope.deleteSpellingBee = function(){
                SpellingBeeFactory.destroy($scope.spellingBeeToDelete)
                .then(function(){
                    $scope.cancelSpellingBee();  
                })
                .then(function(){
                    $state.reload();
                });
            };

          

        },
        resolve: {
            user: function (UserFactory, $stateParams) {
                return UserFactory.fetchById($stateParams.id);
            },
            pickSixes: function (PickSixFactory, user) {
                return PickSixFactory.fetchByOwner(user._id);
            },
            spellingBees: function (SpellingBeeFactory, user) {
                return SpellingBeeFactory.fetchByOwner(user._id);
            }
        },
		authenticate: {
			loggedOut: false
		}
	});
});