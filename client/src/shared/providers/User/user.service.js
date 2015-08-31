angular
  .module('tango')
  .service('User', User)
;

function User($http) {
  this.list = function() {
    return $http.get('/users');
  };

  this.get = function(id) {
    return $http.get('/users/'+id);
  };

  this.update = function(id, newUser) {
    return $http.put('/users/'+id, newUser);
  };

  this.delete = function(id) {
    return $http.delete('/users/'+id);
  };
}
