angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('change-password', {
      url: '/change-password/:id',
      templateUrl: '/components/users/changePassword/changePassword.html',
      controller: 'ChangePasswordController as vm'
    })
  ;
}
