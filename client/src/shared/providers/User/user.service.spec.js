describe('User Service', function() {
  var User, $httpBackend;

  beforeEach(module('mean-starter', 'templates'));
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
    User.list();
    $httpBackend.flush();
  });

  it('#get', function() {
    $httpBackend.expectGET('/users/1').respond();
    User.get(1);
    $httpBackend.flush();
  });

  it('#update', function() {
    var user = { username: 'adamzerner' };
    $httpBackend.expectPUT('/users/1', user).respond();
    User.update(1, user);
    $httpBackend.flush();
  });

  it('#delete', function() {
    $httpBackend.expectDELETE('/users/1').respond();
    User.delete(1);
    $httpBackend.flush();
  });
});
