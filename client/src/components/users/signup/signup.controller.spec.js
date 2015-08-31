describe('SignupController', function() {
  var createController, Auth;
  var user = {
    username: 'a',
    password: 'password',
    passwordConfirmation: 'password'
  };

  beforeEach(module('tango', 'templates'));
  beforeEach(inject(function($controller, _Auth_) {
    Auth = _Auth_;
    createController = function() {
      return $controller('SignupController');
    };
  }));

  it('can submit when valid', function() {
    var vm = createController();
    spyOn(Auth, 'signup').and.callThrough();
    vm.user = user;
    vm.submit(true);
    expect(vm.user.passwordConfirmation).toBeFalsy();
    expect(Auth.signup).toHaveBeenCalledWith(vm.user);
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
