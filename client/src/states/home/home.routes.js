angular
  .module('tango')
  .config(config)
;

function config ($stateProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: '/states/home/home.html',
      controller: 'HomeController as vm'
    })
  ;
}
