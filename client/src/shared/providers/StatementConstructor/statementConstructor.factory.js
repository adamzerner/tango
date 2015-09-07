angular
  .module('tango')
  .factory('StatementConstructor', StatementConstructorFactory)
;

function StatementConstructorFactory() {
  return function StatementConstructor() {
    this.text = '';
    this.children = [];
    this.focus = true;
    this.childrenHidden = false;
  }
}
