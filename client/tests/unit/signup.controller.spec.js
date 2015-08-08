describe('SignupController', function() {
  var createController, $httpBackend;

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    createController = function() {
      return $controller('SignupController');
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
