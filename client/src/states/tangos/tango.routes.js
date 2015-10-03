angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('tango::new', {
      url: '/tango/new',
      templateUrl: '/states/tangos/tango.html',
      controller: 'TangoController as vm'
    })
    .state('tango', {
      url: '/tango/:id',
      templateUrl: '/states/tangos/tango.html',
      controller: 'TangoController as vm'
    })
  ;
}
