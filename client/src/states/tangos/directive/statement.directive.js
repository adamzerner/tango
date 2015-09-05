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
      vm.indentRight = function() {
        console.log('indent');
      };
      vm.indentLeft = function() {
        console.log('indent back');
      };

      // key bindings
      vm.shortCut = function(e) {
        if (e.metaKey) {
          if (e.shiftKey && e.which === 13) { // cmd + shift + enter
            vm.createChild(e);
          }
          else if (e.which === 13) { // cmd + enter
            vm.insertNextStatement(e);
          }
          else if (e.keyCode === 39) { // cmd + right arrow
            e.preventDefault();
            vm.indentRight();
          }
          else if (e.keyCode === 37) { // cmd + left arrow
            e.preventDefault();
            vm.indentLeft();
          }
        }
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
