angular
  .module('auth', [])
  .factory('Auth', Auth)
;

function Auth($http, $cookies, $q, $rootScope) {
  return {
    logout: function() {
      $http
        .get('/logout')
        .then(function() {
          angular.copy({}, $rootScope.user);
          $cookies.remove('userId');
        })
        .catch(function() {
          console.log('Problem logging out.');
        })
      ;
    },

    getCurrentUser: function() {
      // user is logged in
      if (Object.keys($rootScope.user).length > 0) {
        return $q.when($rootScope.user);
      }
      // user is logged in, but page has been refreshed and $rootScope.user is lost
      if ($cookies.get('userId')) {
        return $http.get('/current-user')
          .then(function(response) {
            angular.copy(response.data, $rootScope.user);
            return $rootScope.user;
          })
        ;
      }
      // user isn't logged in
      else  {
        return $q.when({});
      }
    },

    requestCurrentUser: function() {
      return $http
        .get('/current-user')
        .then(function(response) {
          angular.copy(response.data, $rootScope.user);
          $cookies.put('userId', response.data._id);
          return $rootScope.user;
        })
      ;
    }
  };
}
