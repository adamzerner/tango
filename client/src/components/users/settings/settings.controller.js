angular
  .module('mean-starter')
  .controller('SettingsController', SettingsController)
;

function SettingsController($stateParams, $window, User, Auth) {
  var vm = this;
  User
    .get($stateParams.id)
    .success(function(data) {
      vm.user = data;
    })
    .error(function() {
      console.log('Problem getting the current user.');
    })
  ;

  vm.invalidSubmitAttempted = false;
  vm.submit = function(isValid) {
    if (isValid) {
      User
        .update(vm.user._id, vm.user)
        .success(function(data) {
          $window.location.href = '/profile/' + vm.user._id; // $state doesn't update the navbar
        })
        .error(function() {
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
      .success(function() {
        Auth.logout();
      })
      .error(function() {
        console.log('Problem deleting the user.');
      })
    ;
  };
}
