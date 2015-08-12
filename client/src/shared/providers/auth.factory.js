angular
  .module('mean-starter')
  .factory('Auth', Auth)
;

function Auth($http, $state, $window, $cookies, $q) {
  var currentUser = {};

  return {
    signup: function(user) {
      return $http
        .post('/users', user)
        .then(function(response) {
          angular.copy(response.data, currentUser);
          $cookies.put('userId', response.data._id);
          $window.location.href = '/';
        })
      ;
    },
    login: function(user) {
      return $http
        .post('/login', user)
        .then(function(response) {
          angular.copy(response.data, currentUser);
          $cookies.put('userId', response.data._id);
          $window.location.href = '/';
        })
      ;
    },
    logout: function() {
      $http
        .get('/logout')
        .then(function() {
          angular.copy({}, currentUser);
          $cookies.remove('userId');
          $window.location.href = '/';
        })
        .catch(function() {
          console.log('Problem logging out.');
        })
      ;
    },
    getCurrentUser: function() {
      // user is logged in
      if (currentUser._id) {
        return $q.when(currentUser);
      }
      // user is logged in, but page has been refreshed and currentUser is lost
      if ($cookies.get('userId')) {
        return $http.get('/current-user')
          .then(function(response) {
            angular.copy(response.data, currentUser);
            return response.data;
          })
        ;
      }
      // user isn't logged in
      else  {
        return $q.when(currentUser);
      }
    }
  };
}
