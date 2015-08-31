angular
  .module('tango')
  .controller('SignupController', SignupController)
;

function SignupController(Auth, $window) {
  var vm = this;
  vm.invalidSubmitAttempted = false;
  vm.usernameExists = false;
  vm.submit = function(isValid) {
    if (isValid) {
      delete vm.user.passwordConfirmation;
      Auth
        .signup(vm.user)
        .catch(function(response) {
          if (response.data === 'Username already exists.') {
            vm.usernameExists = true;
          }
          else {
            console.log('Problem signing up.');
          }
        })
      ;
    }
    else {
      vm.invalidSubmitAttempted = true;
    }
  };
  vm.closeAlert = function() {
    vm.usernameExists = false;
  };

  // SSO
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
