angular
  .module('mean-starter', ['ui.router', 'ui.bootstrap', 'ngCookies', 'ngMessages'])
  .config(config)
  .run(run)
;

function config($locationProvider, $urlRouterProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/');
}

function run($http, Session, $cookies) {
  $http
    .get('/current-user')
    .then(function(response) {
      Session.setUser(response.data);
      $cookies.put('userId', response.data._id);
    })
  ;
}
