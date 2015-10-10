angular
  .module('tango')
  .controller('MyTangosController', MyTangosController)
;

function MyTangosController(User, $stateParams, Tango) {
  var vm = this;

  User.get($stateParams.id)
    .then(function(response) {
      vm.user = response.data;
    })
    .catch(function() {
      console.log('Unable to get user.');
    })
  ;

  vm.alertSuccess = false;
  vm.alertFailure = false;
  vm.closeAlertSuccess = function() {
    vm.alertSuccess = false;
  };
  vm.closeAlertFailure = function() {
    vm.alertFailure = false;
  };

  vm.remove = function(tango) {
    Tango
      .delete(tango._id)
      .then(function() {
        vm.alertSuccess = true;

        var index = vm.user.tangos.indexOf(tango);
        vm.user.tangos.splice(index, 1);
      })
      .catch(function() {
        vm.alertFailure = true;
      })
    ;
  };
}
