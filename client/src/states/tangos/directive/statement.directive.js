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
      parent: '=',
      level: '@'
    },
    controller: function statementController(StatementConstructor) {
      var vm = this;
      vm.insertNextStatement = function(e) {
        e.preventDefault();
        var newStatement = new StatementConstructor();
        var currIndex = vm.parent.indexOf(vm.statement);
        vm.parent.splice(currIndex+1, 0, newStatement);
      };
      vm.createChild = function(e) {
        e.preventDefault();
        var newStatement = new StatementConstructor();
        vm.statement.children.push(newStatement);
      };
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
