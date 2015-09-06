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
        var parent = vm.statement.parent;
        var parentArr = parent.children || parent;
        var index = parentArr.indexOf(vm.statement);
        if (index > 0) {
          parentArr[index-1].children.push(vm.statement);
          vm.statement.parent = parentArr[index-1];
          parentArr.splice(index, 1);
        }
        else {
          console.log('can\'t indent right');
        }
      };
      vm.indentLeft = function() {
        var parent = vm.statement.parent;
        var grandparent = parent.parent;
        if (!grandparent) {
          console.log('can\'t indent left');
          return;
        }
        // insert statement into new position
        var grandparentArr = grandparent.children || grandparent;
        var grandparentIndex = grandparentArr.indexOf(parent);
        var statementCopy = angular.copy(vm.statement);
        grandparentArr.splice(grandparentIndex+1, 0, vm.statement);
        vm.statement.parent = grandparent;
        // remove statement from old position
        var parentIndex = parent.children.indexOf(vm.statement);
        parent.children.splice(parentIndex, 1);
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
