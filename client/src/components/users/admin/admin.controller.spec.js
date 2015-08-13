describe('AdminController', function() {
  var createController, User;

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _User_) {
    User = _User_;
    createController = function() {
      return $controller('AdminController');
    };
  }));

  it('gets users when loaded', function() {
    spyOn(User, 'list').and.callThrough();
    createController();
    expect(User.list).toHaveBeenCalled();
  });

  it('can delete', function() {
    spyOn(User, 'delete').and.callThrough();
    var vm = createController();
    vm.delete(1);
    expect(User.delete).toHaveBeenCalled();
  });

});
