angular
  .module('mean-starter')
  .controller('HomeController', HomeController);

function HomeController() {
  var vm = this;
  vm.foo = 'bar';
}
