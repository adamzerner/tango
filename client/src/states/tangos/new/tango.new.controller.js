angular
  .module('tango')
  .controller('NewTangoController', NewTangoController)
;

function NewTangoController($scope, $timeout, StatementConstructor) {
  var vm = this;
  vm.tango = {};

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

  // vm.tango.statements = [{
  //   text: '1',
  //   children: []
  // }, {
  //   text: '2',
  //   children: [{
  //     text: '2.1',
  //     children: []
  //   }, {
  //     text: '2.2',
  //     children: [{
  //       text: '2.2.1',
  //       children: []
  //     }]
  //   }]
  // }];
}
