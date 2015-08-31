angular
  .module('tango')
  .directive('navbar', navbar)
;

function navbar() {
  return {
    restrict: 'E',
    templateUrl: '/components/navbar/navbar.directive.html',
    controller: NavbarController,
    controllerAs: 'vm'
  };
}

function NavbarController(Auth, $rootScope) {
  var vm = this;
  vm.currentUser = $rootScope.user;
  vm.logout = function() {
    Auth.logout();
  };
}
