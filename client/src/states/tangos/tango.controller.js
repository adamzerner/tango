angular
  .module('tango')
  .controller('TangoController', TangoController)
;

function TangoController($scope, $timeout, StatementConstructor, Tango, $stateParams) {
  var vm = this;
  vm.tango = {};

  if ($stateParams.id) {
    Tango
      .get($stateParams.id)
      .then(function(response) {
        vm.tango = response.data;
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
  }

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

  vm.createTango = function() {
    removeParentProperty(vm.tango.statements);

    Tango
      .create(vm.tango)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(response) {
        console.log(response);
      })
    ;
  };

  function removeParentProperty(statements) {
    for (var i = 0, len = statements.length; i < len; i++) {
      statements[i] = _.omit(statements[i], 'parent');
      if (statements[i].children.length > 0) {
        removeParentProperty(statements[i].children);
      }
    }
  }
}
