describe('LoginController', function() {
  var createController, $httpBackend;
  var user = {
    _id: 1,
    username: 'adamzerner',
    password: 'test',
    passwordConfirmation: 'test'
  };

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    createController = function() {
      return $controller('LoginController');
    };
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  // it('can submit when valid', function() {
  //   var vm = createController();
  //   vm.user = user;
  //   $httpBackend.expectPOST('/login', user).respond(user);
  //   vm.submit(true);
  //   $httpBackend.flush();
  // });
  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
