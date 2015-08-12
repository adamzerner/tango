angular
  .module('mean-starter')
  .service('Session', Session)
;

function Session() {
  this.setUser = function(user) {
    this.user = user;
  };
  this.removeUser = function() {
    this.user = null;
  }
}
