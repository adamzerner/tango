angular
  .module('mean-starter')
  .controller('ChangePasswordController', ChangePasswordController)
;

function ChangePasswordController($stateParams, User) {
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
      delete vm.user.passwordConfirmation;
      User
        .update(vm.user._id, vm.user)
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
