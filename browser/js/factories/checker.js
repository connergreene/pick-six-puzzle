'use strict';
app.factory('checkFactory', function($http) {

	return {
		checkPickSix(letters) {
			return $http({
				url: '/pick-six/' + letters,
				method: 'GET'
			})
			.then(res => res.data);
		},

		checkSpellingBee(letters) {
			return $http({
				url: '/spelling-bee/' + letters,
				method: 'GET'
			})
			.then(res => res.data);
		}

	};
});