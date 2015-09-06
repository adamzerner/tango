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
    controller: function statementController(StatementConstructor, $sce) {
      var vm = this;
      console.log(vm.statement);
      vm.insertNextStatementHtml = $sce.trustAsHtml('Insert next statement<br />(cmd + enter)');
      vm.insertChildHtml = $sce.trustAsHtml('Create child<br />(cmd + shift + enter)');
      vm.indentRightHtml = $sce.trustAsHtml('Indent right<br />(cmd + -->)');
      vm.indentLeftHtml = $sce.trustAsHtml('Indent left<br />(cmd + <--)');
      vm.insertNextStatement = function(e) {
        e.preventDefault();
        var newStatement = new StatementConstructor();
        newStatement.parent = vm.statement.parent;
        var parentArr = vm.statement.parent.children || vm.statement.parent;
        var currIndex = parentArr.indexOf(vm.statement);
        parentArr.splice(currIndex+1, 0, newStatement);
      };
      vm.insertChild = function(e) {
        e.preventDefault();
        var newStatement = new StatementConstructor();
        newStatement.parent = vm.statement;
        vm.statement.children.unshift(newStatement);
      };
      vm.indentRight = function() {
        // just have to navigate the array, don't have to deal with the DOM
        console.log('indent');
      };
      vm.indentLeft = function() {
        if (vm.level === '0') {
          return;
        }

        console.log('indent back');
      };

      // key bindings
      vm.shortCut = function(e) {
        if (e.metaKey) {
          if (e.shiftKey && e.which === 13) { // cmd + shift + enter
            vm.insertChild(e);
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
