describe('ChangePasswordController', function() {
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
      return $controller('ChangePasswordController', {
        $stateParams: { id: 1 }
      });
    };
  }));
  beforeEach(function() {
    $httpBackend.expectGET('/users/1').respond(user);
  });
  // beforeEach(function() {
  //   $httpBackend.whenGET('/current-user').respond(user);
  // });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('gets user', function() {
    var vm = createController();
    $httpBackend.flush();
    expect(vm.user).toEqual(user);
  });

  it('can submit', function() {
    var vm = createController();
    $httpBackend.flush();
    vm.submit(true);
    $httpBackend.expectPUT('/users/1').respond();
    $httpBackend.flush();
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    $httpBackend.flush();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
