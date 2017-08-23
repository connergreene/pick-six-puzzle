
'use strict';
window.app = angular.module('times-games', ['ui.router', 'ui.bootstrap'])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise("/");
});