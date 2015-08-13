describe('ChangePasswordController', function() {
  var createController, User;
  var user = {
    _id: 1,
    username: 'adamzerner',
    password: 'test',
    passwordConfirmation: 'test'
  };

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _User_) {
    User = _User_;
    createController = function() {
      return $controller('ChangePasswordController', {
        $stateParams: { id: 1 }
      });
    };
  }));

  it('gets user', function() {
    spyOn(User, 'get').and.callThrough();
    var vm = createController();
    expect(User.get).toHaveBeenCalled();
  });

  it('can submit', function() {
    var vm = createController();
    vm.user = user;
    spyOn(User, 'update').and.callThrough();
    vm.submit(true);
    expect(vm.user.passwordConfirmation).toBeFalsy();
    expect(User.update).toHaveBeenCalled();
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
