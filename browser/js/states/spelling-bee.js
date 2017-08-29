'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('spelling-bee', {
		url: '/spelling-bee',
		templateUrl: 'browser/js/templates/spelling-bee.html',
		controller: 'spellingBeeCtrl'
	});
});