angular
  .module('tango')
  .directive('tango', tango)
;

function tango(RecursionHelper) {
  return {
    restrict: 'E',
    scope: {
      tango: '=',
      level: '@'
    },
    templateUrl: '/components/tangos/directive/tango.directive.html',
    compile: function(tElement) {
      return RecursionHelper.compile(tElement);
    }
  };
}
