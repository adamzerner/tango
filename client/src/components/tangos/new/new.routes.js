angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('tango:new', {
      url: '/tango/new',
      templateUrl: '/components/tangos/new/new.html',
      controller: 'NewTangoController as vm'
    })
  ;
}
