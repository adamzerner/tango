angular
  .module('mean-starter')
  .factory('Auth', function($http, $state, $window, $cookies) {
    var currentUser = {};
    if ($cookies.get('userId')) {
      $http
        .get('/current-user')
        .then(function(data) {
          angular.copy(data, currentUser);
        })
        .catch(function() {
          console.log('Problem getting the current user.');
        })
      ;
    }

    return {
      signup: function(user) {
        return $http
          .post('/users', user)
          .then(function(data, status, headers, config) {
            angular.copy(data, currentUser);
            $cookies.put('userId', data._id);
            $window.location.href = '/';
          })
        ;
      },
      login: function(user) {
        return $http
          .post('/login', user)
          .then(function(data) {
            angular.copy(data, currentUser);
            $cookies.put('userId', data._id);
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
        return currentUser;
      },
      isLoggedIn: function() {
        return !!currentUser._id;
      }
    };
  })
;
