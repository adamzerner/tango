angular
  .module('mean-starter', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages'])
  .config(config)
  .run(run)
;

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}

function run($http, $cookies, $rootScope) {
  $rootScope.user = {};

  // $http
  //   .get('/current-user')
  //   .then(function(response) {
  //     console.log('response.data: ', response.data);
  //     angular.copy(response.data, $rootScope.user);
  //     $cookies.put('userId', response.data._id);
  //   })
  // ;
}
