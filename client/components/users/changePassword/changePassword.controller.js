angular
  .module('mean-starter')
  .controller('ChangePasswordController', ChangePasswordController);

function ChangePasswordController($stateParams, User) {
  var vm = this;
  User
    .get($stateParams.id)
    .success(function(user) {
      vm.user = user;
    })
    .error(function() {
      console.log('Unable to get user.');
    });

  vm.submitAttempted = false;
  vm.submit = function(isValid) {
    if (isValid) {
      delete vm.user.passwordConfirmation;
      User
        .update(vm.user._id, vm.user)
        .success(function() {
          console.log('Successfully updated password.');
        })
        .error(function() {
          console.log('Error updated password.');
        });
    }
    else {
      vm.submitAttempted = true;
    }
  };
}
