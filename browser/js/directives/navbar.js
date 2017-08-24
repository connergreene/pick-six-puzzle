'use strict';

app.directive('navbar', function ($state, $location) {
	return {
		restrict: 'E',
		templateUrl: 'js/templates/navbar.html',
		link: function (scope) {
			scope.pathStartsWithStatePath = function (state) {
				var partial = $state.href(state);
				var path = $location.path();
				return path.startsWith(partial);
			};

			scope.whichPuzzle = function(){
				if ($location.path() === '/pick-six'){
					return 'pick-six';
				}
				else if($location.path() === '/spelling-bee'){
					return 'spelling-bee';
				}
				else {
					return false;
				}
			}

			scope.isHome = function(){
				if ($location.path() === '/'){
					return true;
				}
				else{
					return false;
				}
			};

			scope.open = function() {
				scope.showModal = true;
			};

			scope.ok = function() {
				scope.showModal = false;
			};

			scope.cancel = function() {
				scope.showModal = false;
			};
		}
	}
});