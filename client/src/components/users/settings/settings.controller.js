angular
  .module('mean-starter')
  .controller('SettingsController', SettingsController)
;

function SettingsController($stateParams, $window, User, Auth) {
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

  vm.invalidSubmitAttempted = false;
  vm.submit = function(isValid) {
    if (isValid) {
      User
        .update(vm.user._id, vm.user)
        .then(function(response) {
          $window.location.href = '/profile/' + vm.user._id; // $state doesn't update the navbar
        })
        .catch(function() {
          console.log('Problem updating the user.');
        })
      ;
    }
    else {
      vm.invalidSubmitAttempted = true;
    }
  };
  vm.delete = function() {
    User
      .delete(vm.user._id)
      .then(function() {
        Auth.logout();
      })
      .catch(function() {
        console.log('Problem deleting the user.');
      })
    ;
  };
}
