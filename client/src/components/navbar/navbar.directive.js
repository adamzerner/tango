angular
  .module('mean-starter')
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

function NavbarController(Auth) {
  var vm = this;
  Auth
    .getCurrentUser()
    .then(function(currentUser) {
      vm.currentUser = currentUser;
    })
  ;
  vm.logout = function() {
    Auth.logout();
  };
}
