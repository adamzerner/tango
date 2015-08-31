angular
  .module('tango', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages'])
  .config(config)
  .run(run)
;

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}

function run(Auth, $cookies, $rootScope) {
  $rootScope.user = {};
  Auth.getCurrentUser();
}

// $http
//   .get('/current-user')
//   .then(function(response) {
//     angular.copy(response.data, $rootScope.user);
//     $cookies.put('userId', response.data._id);
//   })
// ;
