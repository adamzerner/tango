angular
  .module('mock-auth', [])
  .factory('Auth', Auth)
;

function Auth() {
  return {
    requestCurrentUser: jasmine.createSpy()
  };
}
