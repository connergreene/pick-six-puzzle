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

			scope.showNav = function(){
				if ($location.path() === '/login'){
					return false;
				}
				else {
					return true;
				}

			}
			scope.whichPage = function(){
				if ($location.path() === '/pick-six'){
					return 'pick-six';
				}
				else if($location.path() === '/spelling-bee'){
					return 'spelling-bee';
				}
				else if($location.path() === '/signup'){
					return 'signup';
				}
				else if($location.path() === '/'){
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

			scope.openLogin = function() {
				scope.showLoginModal = true;
			};

			scope.loginOk = function() {
				scope.showLoginModal = false;
			};

			scope.loginCancel = function() {
				scope.showLoginModal = false;
			};

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
					$state.go('home')
				}, function(){
					scope.userData = {}
				})
			}

			scope.userData = {};
			scope.submitLogin = function(){
				Auth.login(scope.userData)
				.then(function(){
					scope.showLoginModal = false;
					$state.go('user', { id: scope.user._id });
				}, function(){
					scope.userData = {}
				})
			}

			scope.signupPage = function(){
				scope.showLoginModal = false;
				$state.go('signup');
			}

			scope.myPuzzles = function(){
				$state.go('user', { id: scope.user._id });
			}
		}
	}
});