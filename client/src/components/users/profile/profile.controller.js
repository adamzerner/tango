angular
  .module('mean-starter')
  .controller('ProfileController', ProfileController);

function ProfileController(User, $stateParams) {
  var vm = this;
  User
    .get($stateParams.id)
    .success(function(data) {
      vm.user = data;
    })
    .error(function() {
      console.log('Unable to get user.');
    });
}
