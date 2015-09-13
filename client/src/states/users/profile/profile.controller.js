angular
  .module('tango')
  .controller('ProfileController', ProfileController)
;

function ProfileController(User, $stateParams) {
  var vm = this;
  User.get($stateParams.id)
    .then(function(response) {
      vm.user = response.data;
    })
    .catch(function() {
      console.log('Unable to get user.');
    })
  ;
}
