describe('User Service', function() {
  var User, $httpBackend;

  function isPromise(el) {
    return !!el.$$state;
  }

  beforeEach(module('tango', 'mock-auth', 'templates'));
  beforeEach(inject(function(_User_, _$httpBackend_) {
    User = _User_;
    $httpBackend = _$httpBackend_;
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#list', function() {
    $httpBackend.expectGET('/users').respond();
    var retVal = User.list();
    $httpBackend.flush();
    expect(isPromise(retVal)).toBe(true);
  });

  it('#get', function() {
    $httpBackend.expectGET('/users/1').respond();
    var retVal = User.get(1);
    $httpBackend.flush();
    expect(isPromise(retVal)).toBe(true);
  });

  it('#update', function() {
    var user = { username: 'adamzerner' };
    $httpBackend.expectPUT('/users/1', user).respond();
    var retVal = User.update(1, user);
    $httpBackend.flush();
    expect(isPromise(retVal)).toBe(true);
  });

  it('#delete', function() {
    $httpBackend.expectDELETE('/users/1').respond();
    var retVal = User.delete(1);
    $httpBackend.flush();
    expect(isPromise(retVal)).toBe(true);
  });
});
