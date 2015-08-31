describe('ChangePasswordController', function() {
  var createController, User;
  var user = {
    _id: 1,
    local: {
      username: 'a',
      password: 'password',
      passwordConfirmation: 'test',
      role: 'user'
    }
  };

  beforeEach(module('tango', 'templates'));
  beforeEach(inject(function($controller, _User_) {
    User = _User_;
    createController = function() {
      return $controller('ChangePasswordController', {
        $stateParams: { id: 1 }
      });
    };
  }));

  it('gets the user when loaded', function() {
    spyOn(User, 'get').and.callThrough();
    var vm = createController();
    expect(User.get).toHaveBeenCalledWith(1);
  });

  it('can submit when valid', function() {
    var vm = createController();
    vm.user = user;
    spyOn(User, 'update').and.callThrough();
    vm.submit(true);
    expect(vm.user.local.passwordConfirmation).toBeFalsy();
    expect(vm.user.local.role).toBeFalsy();
    expect(User.update).toHaveBeenCalledWith(vm.user._id, vm.user.local);
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
