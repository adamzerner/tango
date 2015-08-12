describe('AdminController', function() {
  var vm, $httpBackend, Auth;
  var users = [ 'user1', 'user2', 'user3' ];

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _$httpBackend_, _Auth_) {
    $httpBackend = _$httpBackend_;
    Auth = _Auth_;
    vm = $controller('AdminController', {
      Auth: Auth
    });
  }));
  beforeEach(function() {
    $httpBackend.expectGET('/users').respond(users);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('gets users when loaded', function() {
    $httpBackend.flush();
    expect(vm.users).toEqual(users);
  });

  describe('#delete', function() {
    it('request is sent out', function() {
      $httpBackend.expectDELETE('/users/1').respond();
      vm.delete(1);
      $httpBackend.flush();
    });
    it('logs you out if you delete yourself', function() {

    });
    it("doesn't log you out if you don't delete yourself", function() {

    });
  });

});

// describe('AdminController', function() {
//   var createController, scope, $httpBackend;
//
//   beforeEach(module('mean-starter'));
//   beforeEach(module('templates'));
//   beforeEach(inject(function($controller, $rootScope, _$httpBackend_) {
//     $httpBackend = _$httpBackend_;
//     scope = $rootScope.$new();
//     createController = function() {
//       return $controller('AdminController');
//     }
//   }));
//
//   afterEach(function() {
//     // $httpBackend.verifyNoOutstandingExpectation();
//     $httpBackend.verifyNoOutstandingRequest();
//   });
//
//   it('gets users', function() {
//     $httpBackend
//       .expectGET('/foo')
//       .respond('foo');
//     var AdminController = createController();
//     $httpBackend.flush();
//   });
// });
