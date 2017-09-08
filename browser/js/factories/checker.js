'use strict';
app.factory('checkFactory', function($http) {

	return {
		checkPickSix(letters) {
			return $http({
				url: '/api/pick-six/check/' + letters,
				method: 'GET'
			})
			.then(res => res.data);
		},

		checkSpellingBee(letters) {
			return $http({
				url: '/api/spelling-bee/check/' + letters,
				method: 'GET'
			})
			.then(res => res.data);
		}

	};
});