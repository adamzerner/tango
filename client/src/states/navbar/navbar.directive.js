angular
  .module('tango')
  .controller('NavbarController', NavbarController)
  .directive('navbar', navbar)
;

function navbar() {
  return {
    restrict: 'E',
    templateUrl: '/states/navbar/navbar.directive.html',
    controller: NavbarController,
    controllerAs: 'vm'
  };
}

function NavbarController(Auth, $state, $rootScope) {
  var vm = this;
  vm.currentUser = $rootScope.user;
  vm.logout = function() {
    Auth.logout()
      .then(function() {
        $state.go('home', { justLoggedOut: true });
      })
    ;
  };
}
