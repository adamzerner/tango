angular
  .module('tango')
  .controller('SettingsController', SettingsController)
;

function SettingsController($stateParams, $state, User, Auth, $rootScope, $cookies) {
  var vm = this;
  User
    .get($stateParams.id)
    .then(function(response) {
      vm.user = response.data;
    })
    .catch(function() {
      console.log('Problem getting the current user.');
    })
  ;

  vm.delete = function() {
    User
      .delete(vm.user._id)
      .then(function() {
        angular.copy({}, $rootScope.user);
        $cookies.remove('userId');
        $state.go('home');
      })
      .catch(function() {
        console.log('Problem deleting the user.');
      })
    ;
  };
}
