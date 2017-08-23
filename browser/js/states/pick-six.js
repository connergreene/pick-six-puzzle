'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('pick-six', {
		url: '/pick-six',
		templateUrl: 'js/templates/pick-six.html',
		controller: 'pickSixCtrl'
	});
});