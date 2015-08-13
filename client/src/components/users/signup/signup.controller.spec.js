describe('SignupController', function() {
  var createController, Auth;

  beforeEach(module('mean-starter', 'templates'));
  beforeEach(inject(function($controller, _Auth_) {
    Auth = _Auth_;
    createController = function() {
      return $controller('SignupController');
    };
  }));

  it('can submit when valid', function() {
    var vm = createController();
    spyOn(Auth, 'signup').and.callThrough();
    vm.submit(true);
    expect(Auth.signup).toHaveBeenCalled();
  });

  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
