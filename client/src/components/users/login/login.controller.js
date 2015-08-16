angular
  .module('mean-starter')
  .controller('LoginController', LoginController)
;

function LoginController(Auth, $window) {
  var vm = this;
  vm.invalidSubmitAttempted = false;
  vm.invalidCredentials = false;
  vm.submit = function(isValid) {
    if (isValid) {
      Auth
        .login(vm.user)
        .catch(function(response) {
          if (response.status === 401) {
            vm.invalidCredentials = true;
          }
        })
      ;
    }
    else {
      vm.invalidSubmitAttempted = true;
    }
  };
  vm.closeAlert = function() {
    vm.invalidCredentials = false;
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
