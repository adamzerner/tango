angular
  .module('mean-starter')
  .config(config);

function config($stateProvider) {
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: '/components/signup/signup.html',
      controller: 'SignupController as vm'
    });
}
