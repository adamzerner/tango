angular
  .module('tango')
  .config(config);
;

function config($stateProvider) {
  $stateProvider
    .state('my-sims', {
      url: '/my-sims/:id',
      templateUrl: '/states/users/mySims/mySims.html',
      controller: 'MySimsController as vm',
      authenticate: {
        authorized: 'user'
      }
    })
  ;
}
