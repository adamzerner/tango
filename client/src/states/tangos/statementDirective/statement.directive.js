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
    controller: function statementController(StatementConstructor, $sce, $timeout, $scope, Reactions) {
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

        // autosize the height of the textarea
        $timeout(function() {
          var ta = document.querySelectorAll('textarea');
          autosize.update(ta);
        }, 0);
      };

      vm.popoverTemplate = 'states/tangos/statementDirective/reactions.html';

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
        vm.statement.focus = false;
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

      // reactions
      vm.reactions = Reactions;
      vm.reactionsPopover;
      vm.currReaction = {};

      vm.hoverReaction = function(reaction) {
        vm.currReaction = reaction;
      };

      vm.selectReaction = function(reaction, e) {
        e.preventDefault();
        vm.reactionsPopover = false;
        vm.statement.reactions.push(reaction.name);
      };

      vm.removeReaction = function(reaction, e) {
        e.preventDefault();
        var index = vm.statement.reactions.indexOf(reaction);
        vm.statement.reactions.splice(index, 1);
      };

      vm.preventDefault = function(e) {
        e.preventDefault();
      };

      // key bindings
      vm.shortCut = function(e) {
        if (e.metaKey && e.ctrlKey) {
          if (e.which === 13) { // enter
            vm.insertNextStatement(e);
          }
          else if (e.which === 219) { // open bracket
            e.preventDefault();
            vm.indentLeft();
          }
          else if (e.which === 221) { // close bracket
            e.preventDefault();
            vm.indentRight();
          }
          else if (e.which === 8) { // delete
            vm.deleteStatement(e);
          }
          else if (e.which === 38) { // up arrow
            vm.upOne(e);
          }
          else if (e.which === 40) { // down arrow
            vm.downOne(e);
          }
          else if (e.which === 74) { // j
            vm.changeSim();
          }
        }
      }
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
