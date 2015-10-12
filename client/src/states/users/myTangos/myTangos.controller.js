angular
  .module('tango')
  .controller('MyTangosController', MyTangosController)
;

function MyTangosController(User, $stateParams, Tango, $uibModal, $rootScope) {
  var vm = this;

  User.get($stateParams.id)
    .then(function(response) {
      vm.user = response.data;
    })
    .catch(function() {
      console.log('Unable to get user.');
    })
  ;

  // privacy
  vm.updatePrivacy = function(tango) {
    Tango
      .update(tango._id, tango)
      .then(function() {
        $rootScope.successAlert = 'Successfully updated privacy.';
      })
      .catch(function() {
        $rootScope.errorAlert = 'Problem updating privacy.';
        tango.private = !tango.private;
      })
    ;
  };
  vm.privacyModal = function() {
    $uibModal.open({
      templateUrl: '/states/users/myTangos/privacyModal.html'
    });
  };

  // remove
  vm.remove = function(tango) {
    Tango
      .delete(tango._id)
      .then(function() {
        $rootScope.successAlert = 'Successfully removed Tango.';

        var index = vm.user.tangos.indexOf(tango);
        vm.user.tangos.splice(index, 1);
      })
      .catch(function() {
        $rootScope.errorAlert = 'Problem removing Tango.';
      })
    ;
  };
}
