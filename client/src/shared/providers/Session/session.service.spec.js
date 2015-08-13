describe('Session Service', function() {
  var Session;
  var user = {
    username: 'username',
    password: 'password'
  };

  beforeEach(module('mean-starter', 'templates'));
  beforeEach(inject(function(_Session_) {
    Session = _Session_;
  }));

  it('#setUser', function() {
    expect(Session.user).toBeFalsy();
    Session.setUser(user);
    expect(Session.user).toEqual(user);
  });

  it('#removeUser', function() {
    Session.setUser(user);
    Session.removeUser();
    expect(Session.user).toBe(null);
  });
});
