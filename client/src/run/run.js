angular
  .module('tango')
  .run(run)
  .directive('textarea', textarea)
;

function run(Auth, $rootScope) {
  $rootScope.user = {};
  Auth.requestCurrentUser();

  $rootScope.closeSuccessAlert = function() {
    $rootScope.successAlert = false;
  };
  $rootScope.closeErrorAlert = function() {
    $rootScope.errorAlert = false;
  };
}

// makes it so that textareas automatically expand vertically as new lines are added
function textarea($timeout) {
  return {
    restrict: 'E',
    link: function(scope, iElement) {
      $timeout(function() {
        autosize(iElement[0]);
      }, 0);
    }
  };
}
