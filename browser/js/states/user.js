'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('user', {
		url: '/users/:id',
		templateUrl: 'browser/js/templates/profile.html',
		controller: function($scope, user, pickSixes, spellingBees){
            $scope.user = user;
            $scope.pickSixes = pickSixes;
            $scope.spellingBees = spellingBees;
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