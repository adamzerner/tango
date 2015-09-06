angular
  .module('tango')
  .controller('NewTangoController', NewTangoController)
;

function NewTangoController($scope) {
  var vm = this;
  // vm.statements = [{
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

  vm.statements = [];
  vm.statements.push({
    text: '',
    children: [],
    parent: vm.statements,
    focus: true // start off with a statement with focus
  });
}
