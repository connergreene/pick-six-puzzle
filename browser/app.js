
'use strict';

window.app = angular.module('times-games', ['ui.router', 'ui.bootstrap']);

app.config(function ($urlRouterProvider, $locationProvider) {
	$locationProvider.html5Mode(true);
	$urlRouterProvider.otherwise('/');
});

app.constant('AUTH_EVENTS', {
	loginSuccess: 'auth-login-success',
	loginFailed: 'auth-login-failed',
	logoutSuccess: 'auth-logout-success',
	sessionTimeout: 'auth-session-timeout',
	notAuthenticated: 'auth-not-authenticated',
	notAuthorized: 'auth-not-authorized'
});

app.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
	var statusDict = {
		401: AUTH_EVENTS.notAuthenticated,
		403: AUTH_EVENTS.notAuthorized,
		419: AUTH_EVENTS.sessionTimeout,
		440: AUTH_EVENTS.sessionTimeout
	};
	return {
		responseError: function (response) {
			$rootScope.$broadcast(statusDict[response.status], response);
			return $q.reject(response)
		}
	};
});

app.config(function ($httpProvider) {
	$httpProvider.interceptors.push([
		'$injector',
		function ($injector) {
			return $injector.get('AuthInterceptor');
		}
	]);
});


app.service('Session', function ($rootScope, AUTH_EVENTS) {

	var self = this;

	$rootScope.$on(AUTH_EVENTS.notAuthenticated, function () {
		self.destroy();
	});

	$rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
		self.destroy();
	});

	this.id = null;
	this.user = null;

	this.create = function (sessionId, user) {
		this.id = sessionId;
		this.user = user;
	};

	this.destroy = function () {
		this.id = null;
		this.user = null;
	};

});

app.run(function($rootScope, Auth, $state){

	function preventStateChange (message, redirect) {
		if (redirect) {
			$state.go(redirect);
		}
		else {
			$state.go('home');
		}
	}

	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
		if (typeof toState.authenticate === 'undefined') {
			return;
		}
		Auth
		.getCurrentUser()
		.then(function (currentUser) {
			var isLoggedIn = !!currentUser._id;
			
			var isAuthorized = isLoggedIn && currentUser._id.toString() === toParams.id;

			if (toState.authenticate.loggedOut) { // this route requires you to be logged out
				if (isLoggedIn) {
					preventStateChange("You're logged in.");
				}
			}
			else if (!isLoggedIn) {
				preventStateChange('Must be logged in to access this route.', 'login');
			}
		})
	});
})