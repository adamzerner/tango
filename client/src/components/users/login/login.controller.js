angular
  .module('mean-starter')
  .controller('LoginController', LoginController)
;

function LoginController(Auth) {
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
}
