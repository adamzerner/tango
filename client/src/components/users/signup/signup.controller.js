angular
  .module('mean-starter')
  .controller('SignupController', SignupController)
;

function SignupController(Auth, $http) {
  var vm = this;
  vm.invalidSubmitAttempted = false;
  vm.usernameExists = false;
  vm.submit = function(isValid) {
    if (isValid) {
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
  vm.facebook = function() {
    console.log('vm.facebook');
    $http
      .get('/auth/facebook')
      .then(function() {
        console.log('Facebook auth success.');
      })
      .catch(function() {
        console.log('Facebook auth failure.');
      });
  };
}
