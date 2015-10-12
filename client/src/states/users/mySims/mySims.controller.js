angular
  .module('tango')
  .controller('MySimsController', MySimsController)
;

function MySimsController($uibModal, $rootScope, $timeout, User) {
  var vm = this;
  vm.user = $rootScope.user;

  vm.openSimModal = function() {
    $uibModal.open({
      templateUrl: '/states/tangos/simModal.html'
    });
  };

  vm.newSim = function() {
    vm.user.sims.push({
      name: ''
    });
    $timeout(function() {
      angular.element('input:last').focus();
    }, 0);
  };
  vm.removeSim = function(sim) {
    var index = vm.user.sims.indexOf(sim);
    vm.user.sims.splice(index, 1);
  };

  vm.save = function() {
    return User.update(vm.user._id, vm.user)
      .then(function() {
        $rootScope.successAlert = 'Successfully saved your Sims.';
      })
      .catch(function() {
        $rootScope.errorAlert = 'Unable to save your Sims.';
      })
    ;
  };
}
