angular
  .module('tango')
  .controller('TangoController', TangoController)
;

function TangoController($scope, $timeout, StatementConstructor, Tango, $stateParams, $state) {
  var vm = this;
  vm.tango = {};
  vm.submitText = 'Create Tango';

  if ($stateParams.id) {
    vm.submitText = 'Update Tango';
    Tango
      .get($stateParams.id)
      .then(function(response) {
        vm.tango = response.data;
        addParents(vm.tango.statements);
      })
    ;
  }

  // title
  vm.tango.title = 'Title (click to edit)';
  vm.titleState = 'show'; // or edit
  vm.editTitle = function() {
    vm.titleState = 'edit';
    $timeout(function() {
      angular.element('.page-header input').focus();
    }, 0);
  };
  vm.showTitle = function() {
    vm.titleState = 'show';
  };

  // sims
  vm.tango.sims = [];
  vm.tango.sims.push({
    name: 'A'
  });
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

  // statements
  vm.tango.statements = [];
  var newStatement = new StatementConstructor();
  newStatement.parent = vm.tango.statements;
  newStatement.focus = true; // start off with a statement with focus
  vm.tango.statements.push(newStatement);

  vm.submit = function() {
    removeParents(vm.tango.statements);

    if (!$stateParams.id) {
      Tango
        .create(vm.tango)
        .then(function(response) {
          $state.go('tango', { id: response.data._id })
        })
        .catch(function(response) {
          vm.alert = 'Failed to create Tango';
        })
      ;
    }
    else {
      Tango
        .update($stateParams.id, vm.tango)
        .then(function(response) {
          vm.updateSuccess = true;
          addParents(vm.tango.statements);
        })
        .catch(function(response) {
          vm.alert = 'Failed to update Tango';
        })
      ;
    }
  };

  // alerts
  vm.alert = false;
  vm.updateSuccess = false;
  vm.closeAlert = function() {
    vm.alert = false;
  };
  vm.closeUpdateSuccess = function() {
    vm.updateSuccess = false;
  };

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
