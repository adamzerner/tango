describe('Auth Factory', function() {
  var Auth, $httpBackend, Session, $cookies, $q;
  var user = {
    username: 'user',
    password: 'password',
  };
  var response = {
    _id: 1,
    username: 'user',
    passwordHash: 'passwordHash'
  };

  function isPromise(el) {
    return !!el.$$state;
  }

  beforeEach(module('mean-starter', 'ngCookies', 'templates'));
  beforeEach(inject(function(_Auth_, _$httpBackend_, _Session_, _$cookies_, _$q_) {
    Auth = _Auth_;
    $httpBackend = _$httpBackend_;
    Session = _Session_;
    $cookies = _$cookies_;
    $q = _$q_;
  }));
  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('#signup', function() {
    $httpBackend.expectPOST('/users', user).respond(response);
    spyOn(Session, 'setUser').and.callThrough();
    spyOn($cookies, 'put').and.callThrough();
    var retVal = Auth.signup(user);
    $httpBackend.flush();
    expect(Session.setUser).toHaveBeenCalled();
    expect($cookies.put).toHaveBeenCalledWith('userId', 1);
    expect(isPromise(retVal)).toBe(true);
  });

  it('#login', function() {
    $httpBackend.expectPOST('/login', user).respond(response);
    spyOn(Session, 'setUser').and.callThrough();
    spyOn($cookies, 'put').and.callThrough();
    var retVal = Auth.login(user);
    $httpBackend.flush();
    expect(Session.setUser).toHaveBeenCalled();
    expect($cookies.put).toHaveBeenCalledWith('userId', 1);
    expect(isPromise(retVal)).toBe(true);
  });

  it('#logout', function() {
    $httpBackend.expectGET('/logout').respond();
    spyOn(Session, 'removeUser');
    spyOn($cookies, 'remove');
    Auth.logout();
    $httpBackend.flush();
    expect(Session.removeUser).toHaveBeenCalled();
    expect($cookies.remove).toHaveBeenCalledWith('userId');
  });

  describe('#getCurrentUser', function() {
    it('User is logged in', function() {
      Session.setUser(response);
      spyOn($q, 'when').and.callThrough();
      var retVal = Auth.getCurrentUser();
      expect($q.when).toHaveBeenCalledWith(Session.user);
      expect(isPromise(retVal)).toBe(true);
    });
    it('User is logged in but page has been refreshed', function() {
      $cookies.put('userId', 1);
      $httpBackend.expectGET('/current-user').respond(response);
      spyOn(Session, 'setUser');
      var retVal = Auth.getCurrentUser();
      $httpBackend.flush();
      expect(Session.setUser).toHaveBeenCalledWith(response);
      expect(isPromise(retVal)).toBe(true);
    });
    it("User isn't logged in", function() {
      Session.removeUser();
      $cookies.remove('userId');
      spyOn($q, 'when').and.callThrough();
      var retVal = Auth.getCurrentUser();
      expect($q.when).toHaveBeenCalledWith({});
      expect(isPromise(retVal)).toBe(true);
    });
  });
});
