'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('signup', {
		url: '/signup',
		templateUrl: 'browser/js/templates/signup.html',
		controller: 'SignupCtrl',
		authenticate: {
			loggedOut: true
		}
	});
});