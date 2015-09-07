angular
  .module('tango')
  .factory('StatementConstructor', StatementConstructorFactory)
;

function StatementConstructorFactory() {
  return function StatementConstructor(simNumber) {
    this.text = '';
    this.children = [];
    this.focus = true;
    this.childrenHidden = false;
    this.simNumber = simNumber || 0;
  }
}
