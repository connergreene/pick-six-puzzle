'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('saved-pick-six', {
		url: '/pick-six/:id',
		templateUrl: '/browser/js/templates/pick-six.html',
		controller:'savedPickSixCtrl',
        resolve: {
            savedPickSix: function (PickSixFactory, $stateParams) {
                return PickSixFactory.fetchById($stateParams.id);
            }
        },
		authenticate: {
			loggedOut: true
		}
	});
});