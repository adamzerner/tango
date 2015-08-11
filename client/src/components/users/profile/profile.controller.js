angular
  .module('mean-starter')
  .controller('ProfileController', ProfileController)
;

function ProfileController(User, $stateParams) {
  var vm = this;
  User
    .get($stateParams.id)
    .then(function(data) {
      vm.user = data;
    })
    .catch(function() {
      console.log('Unable to get user.');
    })
  ;
}
