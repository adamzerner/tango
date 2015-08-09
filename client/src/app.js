angular
  .module('mean-starter', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages'])
  .config(config);

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}
