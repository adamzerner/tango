angular
  .module('tango')
  .controller('NewTangoController', NewTangoController)
;

function NewTangoController($scope, $timeout) {
  var vm = this;
  vm.tango = {};
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

  vm.tango.statements = [];
  vm.tango.statements.push({
    text: '',
    children: [],
    parent: vm.tango.statements,
    focus: true // start off with a statement with focus
  });

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
