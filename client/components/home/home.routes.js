angular
  .module('mean-starter')
  .config(config);

function config ($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/home/home.html',
      controller: 'HomeController'
    });
}
