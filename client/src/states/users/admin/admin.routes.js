angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: '/states/users/admin/admin.html',
      controller: 'AdminController as vm',
      authenticate: {
        admin: true
      }
    })
  ;
}
