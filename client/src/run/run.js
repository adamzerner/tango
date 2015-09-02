angular
  .module('tango')
  .run(run)
;

function run(Auth, $rootScope) {
  $rootScope.user = {};
  Auth.requestCurrentUser();
}
