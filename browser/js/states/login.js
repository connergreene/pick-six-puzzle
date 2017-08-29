'use strict';

app.config(function ($stateProvider) {
	$stateProvider.state('login', {
		url: '/',
		templateUrl: 'browser/js/templates/login.html',
		controller: 'LoginCtrl',
		authenticate: {
			loggedOut: true
		}
	});
});