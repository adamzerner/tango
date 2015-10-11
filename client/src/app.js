angular
  .module('tango', ['auth', 'ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages', 'ngAnimate', 'tabby'])
  .config(config)
;

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}
