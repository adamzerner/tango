angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('my-tangos', {
      url: '/my-tangos/:id',
      templateUrl: '/states/users/myTangos/myTangos.html',
      controller: 'MyTangosController as vm',
      authenticate: {
        authorized: 'user'
      }
    })
  ;
}
