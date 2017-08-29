'use strict';

app.factory('Auth', function ($http, $q, $rootScope, Session, AUTH_EVENTS) {

  function onSuccessfulLogin(response) {
      var data = response.data;
      Session.create(data.id, data.user);
      $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
      return data.user;
  }

  return {
    isAuthenticated: function () {
      return !!Session.user;
    },

    getCurrentUser: function (fromServer) {
      if (this.isAuthenticated() && fromServer !== true) {
        return $q.when(Session.user);
      }
      return $http.get('/session')
                  .then(onSuccessfulLogin)
                  .catch(function () {
                            return $q.when({});
                  });
    },

    login: function (credentials) {
        return $http.post('/auth/login', credentials)
        .then(onSuccessfulLogin)
        .catch(function () {
            return $q.reject({ message: 'Invalid login credentials.' });
        });
    },

    logout: function () {
        return $http.get('/auth/logout')
        .then(function () {
            Session.destroy();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        });
    }

  };

});