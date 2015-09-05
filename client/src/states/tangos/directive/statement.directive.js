angular
  .module('tango')
  .directive('statement', statement)
;

function statement(RecursionHelper) {
  return {
    restrict: 'E',
    templateUrl: '/states/tangos/directive/statement.directive.html',
    scope: {
      statement: '=',
      level: '@'
    },
    controller: function statementController() {

    },
    controllerAs: 'vm',
    bindToController: true,
    compile: function statementCompile(tElement) {
      return RecursionHelper.compile(tElement, function(scope, iElement, iAttrs) {
        // start off with one statement with focus
        if (scope.vm.statement.focus) {
          scope.vm.focus = true;
          iElement.find('textarea')[0].focus();
        }
      });
    }
  };
}
