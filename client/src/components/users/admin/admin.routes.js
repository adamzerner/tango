angular
  .module('mean-starter')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('admin', {
      url: '/admin',
      templateUrl: '/components/users/admin/admin.html',
      controller: 'AdminController as vm',
      authenticate: {
        isAdmin: true
      }
    })
  ;
}
