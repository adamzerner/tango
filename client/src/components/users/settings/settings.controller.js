angular
  .module('mean-starter')
  .controller('SettingsController', SettingsController)
;

function SettingsController($stateParams, $state, User, Auth) {
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
        .update(vm.user._id, vm.user.local)
        .then(function(response) {
          $state.go('profile', { id: vm.user._id });
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
