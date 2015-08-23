angular
  .module('mean-starter')
  .factory('Auth', Auth)
;

function Auth($http, $state, $window, $cookies, $q, Session, $rootScope) {
  return {
    signup: function(user) {
      return $http
        .post('/users', user)
        .then(function(response) {
          $rootScope.user = response.data;
          $cookies.put('userId', response.data._id);
          // $window.location.href = '/';
        })
      ;
    },
    login: function(user) {
      return $http
        .post('/login', user)
        .then(function(response) {
          $rootScope.user = response.data;
          $cookies.put('userId', response.data._id);
          // $window.location.href = '/';
        })
      ;
    },
    logout: function() {
      $http
        .get('/logout')
        .then(function() {
          $rootScope.user = {};
          $cookies.remove('userId');
          // $window.location.href = '/';
        })
        .catch(function() {
          console.log('Problem logging out.');
        })
      ;
    },
    getCurrentUser: function() {
      // user is logged in
      if ($rootScope.user) {
        return $q.when($rootScope.user);
      }
      // user is logged in, but page has been refreshed and Session.user is lost
      if ($cookies.get('userId')) {
        return $http.get('/current-user')
          .then(function(response) {
            $rootScope.user = response.data;
            return response.data;
          })
        ;
      }
      // user isn't logged in
      else  {
        return $q.when({});
      }
    }
  };
}
