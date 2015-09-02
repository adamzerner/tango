describe('Auth Factory', function() {
  var Auth, $httpBackend, $rootScope, $cookies, $q;
  var user = {
    username: 'a',
    password: 'password',
  };
  var response = {
    _id: 1,
    local: {
      username: 'a',
      role: 'user'
    }
  };

  function isPromise(el) {
    return !!el.$$state;
  }

  beforeEach(module('auth', 'ngCookies', 'templates'));
  beforeEach(inject(function(_Auth_, _$httpBackend_, _$rootScope_, _$cookies_, _$q_) {
    Auth = _Auth_;
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $cookies = _$cookies_;
    $q = _$q_;
    $rootScope.user = {};
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#logout', function() {
    $httpBackend.expectGET('/logout').respond();
    spyOn(angular, 'copy').and.callThrough();
    spyOn($cookies, 'remove');
    Auth.logout();
    $httpBackend.flush();
    expect(angular.copy).toHaveBeenCalledWith({}, $rootScope.user);
    expect($cookies.remove).toHaveBeenCalledWith('userId');
    expect($rootScope)
  });

  describe('#getCurrentUser', function() {
    it('User is logged in', function() {
      $rootScope.user = response;
      spyOn($q, 'when').and.callThrough();
      var retVal = Auth.getCurrentUser();
      expect($q.when).toHaveBeenCalledWith($rootScope.user);
      expect(isPromise(retVal)).toBe(true);
    });
    it('User is logged in but page has been refreshed', function() {
      $cookies.put('userId', 1);
      $httpBackend.expectGET('/current-user').respond(response);
      spyOn(angular, 'copy').and.callThrough();
      var retVal = Auth.getCurrentUser();
      $httpBackend.flush();
      expect(angular.copy).toHaveBeenCalledWith(response, $rootScope.user);
      expect(isPromise(retVal)).toBe(true);
    });
    it("User isn't logged in", function() {
      $rootScope.user = {};
      $cookies.remove('userId');
      spyOn($q, 'when').and.callThrough();
      var retVal = Auth.getCurrentUser();
      expect($q.when).toHaveBeenCalledWith({});
      expect(isPromise(retVal)).toBe(true);
    });
  });
  it('#requestCurrentUser', function() {
    $httpBackend.expectGET('/current-user').respond(response);
    spyOn(angular, 'copy').and.callThrough();
    spyOn($cookies, 'put').and.callThrough();
    var retVal = Auth.requestCurrentUser();
    $httpBackend.flush();
    expect(angular.copy).toHaveBeenCalledWith(response, $rootScope.user);
    expect($cookies.put).toHaveBeenCalledWith('userId', response._id);
    expect(isPromise(retVal)).toBe(true);
    expect($rootScope.user).toEqual(response);
  });
});
