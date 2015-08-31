angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: '/components/users/login/login.html',
      controller: 'LoginController as vm',
      authenticate: {
        loggedOut: true
      }
    })
  ;
}
