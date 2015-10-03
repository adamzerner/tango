angular
  .module('tango')
  .service('Tango', Tango)
;

function Tango($http) {
  this.index = function() {
    return $http.get('/tangos');
  };

  this.get = function(id) {
    return $http.get('/tangos/' + id);
  };

  this.create = function(tango) {
    return $http.post('/tangos', tango);
  };

  this.update = function(id, tango) {
    return $http.put('/tangos/' + id, tango);
  };

  this.delete = function(id) {
    return $http.delete('/tangos/' + id);
  };
}
