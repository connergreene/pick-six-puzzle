'use strict';

app.directive('navbar', function ($rootScope, $state, $location, Auth, AUTH_EVENTS) {
	return {
		restrict: 'E',
		templateUrl: 'browser/js/templates/navbar.html',
		link: function (scope) {
			scope.pathStartsWithStatePath = function (state) {
				var partial = $state.href(state);
				var path = $location.path();
				return path.startsWith(partial);
			};

			scope.whichPage = function(){
				if ($location.path() === '/pick-six'){
					return 'pick-six';
				}
				else if($location.path() === '/spelling-bee'){
					return 'spelling-bee';
				}
				else if($location.path() === '/home'){
					return 'home';
				}
				else {
					return false;
				}
			}


			scope.open = function() {
				scope.showModal = true;
			};

			scope.ok = function() {
				scope.showModal = false;
			};

			scope.cancel = function() {
				scope.showModal = false;
			};

			scope.user = null;

            scope.isLoggedIn = function () {
                return Auth.isAuthenticated();
            };

            var setUser = function () {
                Auth.getCurrentUser()
                .then(function (user) {
                    scope.user = user;
                });
            };

            var removeUser = function () {
                scope.user = null;
            };

            setUser();

            $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
            $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
            $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

			scope.logOut = function(){
				Auth.logout()
				.then(function(){
					$state.go('login')
				}, function(){
					$scope.userData = {}
				})
			}

			scope.myPuzzles = function(){
				$state.go('user', { id: scope.user._id });
			}
		}
	}
});