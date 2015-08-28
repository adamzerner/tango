angular
  .module('mean-starter')
  .factory('Auth', Auth)
;

function Auth($http, $state, $window, $cookies, $q, $rootScope) {
  return {
    signup: function(user) {
      return $http
        .post('/users', user)
        .then(function(response) {
          angular.copy(response.data, $rootScope.user);
          $cookies.put('userId', response.data._id);
          $state.go('home');
        })
      ;
    },
    login: function(user) {
      return $http
        .post('/login', user)
        .then(function(response) {
          angular.copy(response.data, $rootScope.user);
          $cookies.put('userId', response.data._id);
          $state.go('home');
        })
      ;
    },
    logout: function() {
      $http
        .get('/logout')
        .then(function() {
          angular.copy({}, $rootScope.user);
          $cookies.remove('userId');
          $state.go('home');
        })
        .catch(function() {
          console.log('Problem logging out.');
        })
      ;
    },
    getCurrentUser: function() {
      // user is logged in
      if (Object.keys($rootScope.user).length > 0) {
        console.log(1);
        return $q.when($rootScope.user);
      }
      // user is logged in, but page has been refreshed and $rootScope.user is lost
      if ($cookies.get('userId')) {
        console.log(2);
        return $http.get('/current-user')
          .then(function(response) {
            angular.copy(response.data, $rootScope.user);
            return $rootScope.user;
          })
        ;
      }
      // user isn't logged in
      else  {
        console.log(3);
        return $q.when({});
      }
    }
  };
}
