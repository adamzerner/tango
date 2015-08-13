angular
  .module('mean-starter')
  .factory('Auth', Auth)
;

function Auth($http, $state, $window, $cookies, $q, Session) {
  return {
    signup: function(user) {
      return $http
        .post('/users', user)
        .then(function(response) {
          Session.setUser(response.data);
          $cookies.put('userId', response.data._id);
          // $window.location.href = '/';
        })
      ;
    },
    login: function(user) {
      return $http
        .post('/login', user)
        .then(function(response) {
          Session.setUser(response.data);
          $cookies.put('userId', response.data._id);
          // $window.location.href = '/';
        })
      ;
    },
    logout: function() {
      $http
        .get('/logout')
        .then(function() {
          Session.removeUser();
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
      if (Session.user) {
        return $q.when(Session.user);
      }
      // user is logged in, but page has been refreshed and Session.user is lost
      if ($cookies.get('userId')) {
        return $http.get('/current-user')
          .then(function(response) {
            Session.setUser(response.data);
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
