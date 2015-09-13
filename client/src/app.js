angular
  .module('tango', ['auth', 'ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages', 'tabby'])
  .config(config)
;

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}
