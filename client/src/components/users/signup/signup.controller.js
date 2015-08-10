angular
  .module('mean-starter')
  .controller('SignupController', SignupController);

function SignupController(Auth) {
  var vm = this;
  vm.invalidSubmitAttempted = false;
  vm.usernameExists = false;
  vm.submit = function(isValid) {
    if (isValid) {
      Auth
        .signup(vm.user)
        .error(function(data, status, headers, config) {
          if (data === 'Username already exists.') {
            vm.usernameExists = true;
          }
          else {
            console.log('Problem signing up.');
          }
        });
    }
    else {
      vm.invalidSubmitAttempted = true;
    }
  };
  vm.closeAlert = function() {
    vm.usernameExists = false;
  };
}
