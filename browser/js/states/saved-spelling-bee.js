'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('saved-spelling-bee', {
		url: '/spelling-bee/:id',
		templateUrl: '/browser/js/templates/spelling-bee.html',
		controller:'savedSpellingBeeCtrl',
        resolve: {
            savedSpellingBee: function (SpellingBeeFactory, $stateParams) {
                return SpellingBeeFactory.fetchById($stateParams.id);
            }
        },
		authenticate: {
			loggedOut: true
		}
	});
});