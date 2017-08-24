
'use strict';
window.app = angular.module('times-games', ['ui.router', 'ui.bootstrap.modal'])
.config(function($urlRouterProvider) {
	$urlRouterProvider.otherwise("/");
});