angular
  .module('tango')
  .controller('NewTangoController', NewTangoController)
;

function NewTangoController() {
  var vm = this;
  vm.foo = 'bar';
}
