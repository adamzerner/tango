angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('tango:new', {
      url: '/tango/new',
      templateUrl: '/states/tangos/new/tango.new.html',
      controller: 'NewTangoController as vm'
    })
  ;
}
