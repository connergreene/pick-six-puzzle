
'use strict';
window.app = angular.module('pick-six', ['ui.router', 'ui.bootstrap'])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise("/");
});