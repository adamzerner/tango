angular
  .module('tango')
  .directive('statement', statement)
;

function statement(RecursionHelper) {
  return {
    restrict: 'E',
    scope: {
      statement: '=',
      level: '@'
    },
    templateUrl: '/states/tangos/directive/statement.directive.html',
    compile: function(tElement) {
      return RecursionHelper.compile(tElement);
    }
  };
}
