'use strict';
app.config(function ($stateProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'browser/js/templates/home.html',
		resolve:{
			setUser : function(Auth){
				return Auth.getCurrentUser();
			}
		}
	});
});