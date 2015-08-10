angular
  .module('mean-starter')
  .directive('navbar', function() {
    return {
      restrict: 'E',
      templateUrl: '/components/navbar/navbar.directive.html',
      controller: NavbarController,
      controllerAs: 'vm'
    };
  })
;

function NavbarController(Auth) {
  var vm = this;
  vm.currentUser = Auth.getCurrentUser();
  vm.logout = function() {
    Auth.logout();
  };
}
