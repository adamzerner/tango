describe('LoginController', function() {
  var createController, Auth;

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _Auth_) {
    Auth = _Auth_;
    createController = function() {
      return $controller('LoginController');
    };
  }));

  it('can submit when valid', function() {
    var vm = createController();
    spyOn(Auth, 'login').and.callThrough();
    vm.submit(true);
    expect(Auth.login).toHaveBeenCalled();
  });
  it('keeps track of whether an invalid submit was attempted', function() {
    var vm = createController();
    expect(vm.invalidSubmitAttempted).toBe(false);
    vm.submit(false);
    expect(vm.invalidSubmitAttempted).toBe(true);
  });
});
