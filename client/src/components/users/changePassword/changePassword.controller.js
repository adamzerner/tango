angular
  .module('mean-starter')
  .controller('ChangePasswordController', ChangePasswordController)
;

function ChangePasswordController($stateParams, User, $rootScope, $state) {
  var vm = this;
  User
    .get($stateParams.id)
    .then(function(response) {
      vm.user = response.data;
    })
    .catch(function() {
      console.log('Unable to get user.');
    })
  ;

  vm.invalidSubmitAttempted = false;
  vm.submit = function(isValid) {
    if (isValid) {
      delete vm.user.local.passwordConfirmation;
      delete vm.user.local.role;
      User
        .update(vm.user._id, vm.user.local)
        .then(function(response) {
          angular.copy(response.data, $rootScope.user);
          $state.go('profile', { id: vm.user._id });
        })
        .catch(function() {
          console.log('Error updated password.');
        })
      ;
    }
    else {
      vm.invalidSubmitAttempted = true;
    }
  };
}
