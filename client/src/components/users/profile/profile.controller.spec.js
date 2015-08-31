describe('ProfileController', function() {
  var createController, User;

  beforeEach(module('tango', 'templates'));
  beforeEach(inject(function($controller, _User_) {
    User = _User_;
    createController = function() {
      return $controller('ProfileController', {
        $stateParams: {
          id: 1
        }
      });
    };
  }));

  it('gets the user when loaded', function() {
    spyOn(User, 'get').and.callThrough();
    var vm = createController();
    expect(User.get).toHaveBeenCalledWith(1);
  });
});
