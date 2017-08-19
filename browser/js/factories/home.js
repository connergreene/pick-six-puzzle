app.factory('HomeFactory', function($http) {

	return {
		getPossibleAnswers(letters) {
			return $http({
				url: '/check/' + letters,
				method: 'GET'
			})
			.then(res => res.data);
		}
	};
});