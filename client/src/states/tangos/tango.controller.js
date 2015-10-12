angular
  .module('tango')
  .controller('TangoController', TangoController)
;

function TangoController($scope, $timeout, StatementConstructor, Tango, $stateParams, $state, $q, $rootScope, $uibModal) {
  var vm = this;

  // sims
  vm.newSim = function() {
    vm.tango.sims.push({
      name: ''
    });
    $timeout(function() {
      angular.element('input:last').focus();
    }, 0);
  };
  vm.removeSim = function(sim) {
    if (vm.tango.sims.length === 1) {
      return;
    }
    var index = vm.tango.sims.indexOf(sim);
    vm.tango.sims.splice(index, 1);
  };
  vm.openSimModal = function() {
    $uibModal.open({
      templateUrl: '/states/tangos/simModal.html'
    });
  };

  vm.submit = function() {
    removeParents(vm.tango.statements);

    if (!$stateParams.id) {
      return Tango
        .create(vm.tango)
        .then(function(response) {
          $rootScope.successAlert = 'Your Tango has been created.';
          $state.go('my-tangos', { id: $rootScope.user._id });
        })
        .catch(function(response) {
          $rootScope.errorAlert = 'Failed to create Tango. All fields are required.';
          addParents(vm.tango.statements);
        })
      ;
    }
    else {
      if (angular.equals(vm.tango, vm.originalTango)) {
        $rootScope.errorAlert = 'You haven\'t made any changes!';
        return $q.when({});
      }

      return Tango
        .update($stateParams.id, vm.tango)
        .then(function(response) {
          $rootScope.successAlert = 'Successfully updated your Tango.';
          addParents(vm.tango.statements);
          vm.originalTango = angular.copy(vm.tango);
        })
        .catch(function(response) {
          $rootScope.errorAlert = 'Failed to update Tango. All fields are required.';
          addParents(vm.tango.statements);
        })
      ;
    }
  };

  if ($stateParams.id) {
    vm.submitText = 'Update Tango';
    Tango
      .get($stateParams.id)
      .then(function(response) {
        vm.tango = response.data;
        vm.originalTango = angular.copy(response.data);
        addParents(vm.tango.statements);
        $timeout(function() {
          angular.element('textarea:first').focus();
        }, 0);

        if (vm.tango.author !== $rootScope.user._id) {
          vm.unauthorized = true;
        }
      })
    ;
  }
  else {
    vm.tango = {};
    vm.submitText = 'Create Tango';

    // title
    vm.tango.title = 'Title';
    $timeout(function() {
      angular.element('.page-header input').focus();
    }, 0);

    // sims
    vm.tango.sims = [];
    vm.tango.sims.push({
      name: 'A'
    });

    // statements
    vm.tango.statements = [];
    var newStatement = new StatementConstructor();
    newStatement.parent = vm.tango.statements;
    vm.tango.statements.push(newStatement);
  }

  function removeParents(statements) {
    for (var i = 0, len = statements.length; i < len; i++) {
      statements[i] = _.omit(statements[i], 'parent');
      if (statements[i].children.length > 0) {
        removeParents(statements[i].children);
      }
    }
  }

  function addParents() {
    if (_.isArray(arguments[0])) {
      var statements = arguments[0];
    }
    else {
      var root = arguments[0];
      var statements = root.children;
    }

    for (var i = 0, len = statements.length; i < len; i++) {
      statements[i].parent = arguments[0];
      if (statements[i].children) {
        addParents(statements[i]);
      }
    }
  }
}
