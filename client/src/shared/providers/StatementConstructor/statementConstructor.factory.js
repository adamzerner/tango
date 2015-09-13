angular
  .module('tango')
  .factory('StatementConstructor', StatementConstructorFactory)
;

function StatementConstructorFactory() {
  return function StatementConstructor(simId) {
    this.text = '';
    this.children = [];
    this.focus = true;
    this.childrenHidden = false;
    this.simId = simId || 0;
  }
}
