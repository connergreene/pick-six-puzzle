'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('spelling-bee', {
		url: '/spelling-bee',
		templateUrl: 'js/templates/spelling-bee.html',
		controller: 'spellingBeeCtrl'
	});
});