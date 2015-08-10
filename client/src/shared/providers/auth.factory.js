angular
  .module('mean-starter')
  .factory('Auth', function($http, $state, $window, $cookies) {
    var currentUser = {};
    if ($cookies.get('userId')) {
      $http
        .get('/current-user')
        .success(function(data) {
          angular.copy(data, currentUser);
        })
        .error(function() {
          console.log('Problem getting the current user.');
        })
      ;
    }

    return {
      signup: function(user) {
        return $http
          .post('/users', user)
          .success(function(data, status, headers, config) {
            angular.copy(data, currentUser);
            $cookies.put('userId', data._id);
            $window.location.href = '/';
          })
        ;
      },
      login: function(user) {
        return $http
          .post('/login', user)
          .success(function(data) {
            angular.copy(data, currentUser);
            $cookies.put('userId', data._id);
            $window.location.href = '/';
          })
        ;
      },
      logout: function() {
        $http
          .get('/logout')
          .success(function() {
            angular.copy({}, currentUser);
            $cookies.remove('userId');
            $window.location.href = '/';
          })
          .error(function() {
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
