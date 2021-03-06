angular
  .module('tango')
  .controller('HomeController', HomeController)
;

function HomeController($window, $rootScope) {
  var vm = this;

  vm.currentUser = $rootScope.user;

  vm.facebook = function() {
    $window.location.href = '/auth/facebook';
  };
  vm.twitter = function() {
    $window.location.href = '/auth/twitter';
  };
  vm.google = function() {
    $window.location.href = '/auth/google';
  };
}
