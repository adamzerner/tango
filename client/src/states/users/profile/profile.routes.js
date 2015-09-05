angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('profile', {
      url: '/profile/:id',
      templateUrl: '/states/users/profile/profile.html',
      controller: 'ProfileController as vm'
    })
  ;
}
