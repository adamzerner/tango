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
      return RecursionHelper.compile(tElement, function(scope, iElement, iAttrs) {
        // start off with one statement with focus
        if (scope.statement.focus) {
          scope.focus = true;
          iElement.find('textarea')[0].focus();
        }
      });
    }
  };
}
