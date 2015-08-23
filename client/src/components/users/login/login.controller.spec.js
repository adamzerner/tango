describe('LoginController', function() {
  var createController, Auth;

  var user = {
    username: 'a',
    password: 'password'
  };

  beforeEach(module('mean-starter', 'templates'));
  beforeEach(inject(function($controller, _Auth_) {
    Auth = _Auth_;
    createController = function() {
      return $controller('LoginController');
    };
  }));

  it('can submit when valid', function() {
    var vm = createController();
    spyOn(Auth, 'login').and.callThrough();
    vm.user = user;
    vm.submit(true);
    expect(Auth.login).toHaveBeenCalledWith(vm.user);
  });
  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
