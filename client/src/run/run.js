angular
  .module('tango')
  .run(run)
;

function run(Auth, $rootScope) {
  $rootScope.user = {};
  Auth.requestCurrentUser();

  angular.element(document).ready(function() {
    autosize(document.getElementsByTagName('textarea'));
  });
}
