angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: '/components/users/signup/signup.html',
      controller: 'SignupController as vm',
      authenticate: {
        loggedOut: true
      }
    })
  ;
}
