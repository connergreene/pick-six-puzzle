'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('pick-six', {
		url: '/',
		templateUrl: 'js/templates/pick-six.html',
		controller: 'pickSixCtrl'
	});
});