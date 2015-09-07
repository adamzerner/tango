angular
  .module('tango')
  .directive('statement', statement)
;

function statement(RecursionHelper) {
  return {
    restrict: 'E',
    templateUrl: '/states/tangos/statementDirective/statement.directive.html',
    scope: {
      statement: '=',
      sims: '=',
      level: '@'
    },
    controller: function statementController(StatementConstructor, $sce, $timeout, $scope) {
      var vm = this;

      vm.sim = vm.sims[vm.statement.simNumber];
      vm.changeSim = function() {
        if (vm.statement.simNumber === vm.sims.length-1) {
          vm.statement.simNumber = 0;
        }
        else {
          vm.statement.simNumber++;
        }
        vm.sim = vm.sims[vm.statement.simNumber];
      };

      vm.hideChildren = function() {
        vm.statement.childrenHidden = true;
      };
      vm.showChildren = function() {
        vm.statement.childrenHidden = false;
      };
      vm.insertNextStatementHtml = $sce.trustAsHtml('Insert next statement<br />(cmd + enter)');
      vm.deleteStatementHtml = $sce.trustAsHtml('Delete statement<br />(cmd + del/backspace)');
      vm.indentRightHtml = $sce.trustAsHtml('Indent right<br />(cmd + -->)');
      vm.indentLeftHtml = $sce.trustAsHtml('Indent left<br />(cmd + <--)');
      vm.upOne = function(e) {
        var textareas = $('textarea');
        var curr;
        if (e.target.localName === 'textarea') {
          curr = e.target;
        }
        else {
          curr = $(e.target).closest('.menu-container').prev();
        }
        var index = textareas.index(curr);
        var previous = textareas[index-1];
        if (previous) {
          previous.focus();
        }
        e.preventDefault();
      };

      vm.downOne = function(e) {
        var textareas = $('textarea');
        var index = textareas.index(e.target);
        var next = textareas[index+1];
        if (next) {
          next.focus();
        }
        e.preventDefault();
      };
      vm.insertNextStatement = function(e) {
        e.preventDefault();
        var newStatement = new StatementConstructor(vm.statement.simNumber);
        newStatement.parent = vm.statement.parent;
        var parentArr = vm.statement.parent.children || vm.statement.parent;
        var currIndex = parentArr.indexOf(vm.statement);
        parentArr.splice(currIndex+1, 0, newStatement);
      };
      vm.deleteStatement = function(e) {
        var parent = vm.statement.parent;
        if (!parent.children && parent.length === 1) {
          console.log('can\'t delete');
          return; // can't delete the only statement
        }
        var parentArr = parent.children || parent;
        var index = parentArr.indexOf(vm.statement);
        parentArr.splice(index, 1);
        vm.upOne(e);
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
          if (e.which === 13) { // cmd + enter
            vm.insertNextStatement(e);
          }
          else if (e.which === 37) { // cmd + left arrow
            e.preventDefault();
            vm.indentLeft();
          }
          else if (e.which === 39) { // cmd + right arrow
            e.preventDefault();
            vm.indentRight();
          }
          else if (e.which === 8) { // cmd + delete
            vm.deleteStatement(e);
          }
          else if (e.which === 38) { // cmd + up arrow
            vm.upOne(e);
          }
          else if (e.which === 40) { // cmd + down arrow
            vm.downOne(e);
          }
          else if (e.which === 74) { // cmd + j
            vm.changeSim();
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
