angular
  .module('tango')
  .config(config)
;

function config($stateProvider) {
  $stateProvider
    .state('settings', {
      url: '/settings/:id',
      templateUrl: '/components/users/settings/settings.html',
      controller: 'SettingsController as vm',
      authenticate: {
        authorized: true
      }
    })
  ;
}
