describe('Run Block', function() {
  var $rootScpe, Auth;

  beforeEach(module('tango', 'mock-auth', 'templates'));
  beforeEach(inject(function(_$rootScope_, _Auth_) {
    $rootScope = _$rootScope_;
    Auth = _Auth_;
  }));

  it('current user starts off empty', function() {
    expect($rootScope.user).toEqual({});
  });

  it('gets the current user', function() {
    expect(Auth.requestCurrentUser).toHaveBeenCalled();
  });
});
