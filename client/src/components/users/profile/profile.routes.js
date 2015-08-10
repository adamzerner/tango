angular
  .module('mean-starter')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('profile', {
      url: '/profile/:id',
      templateUrl: '/components/users/profile/profile.html',
      controller: 'ProfileController as vm'
    })
  ;
}
