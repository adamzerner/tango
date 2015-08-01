angular
  .module('mean-starter')
  .controller('HomeController', HomeController);

function HomeController() {
  console.log('HomeController running');
  var vm = this;
  vm.foo = 'bar';
}
