describe('SettingsController', function() {
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
      return $controller('SettingsController', {
        $stateParams: {
          id: 1
        }
      });
    }
  }));
  beforeEach(function() {
    $httpBackend.expectGET('/users/1').respond(user);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('gets user', function() {
    var vm = createController();
    $httpBackend.flush();
    expect(vm.user).toEqual(user);
  });
  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    $httpBackend.flush();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
