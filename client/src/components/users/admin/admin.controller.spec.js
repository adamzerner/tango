describe('AdminController', function() {
  var createController, $httpBackend;
  var users = [ 'user1', 'user2', 'user3' ];

  beforeEach(module('mean-starter'));
  beforeEach(module('templates'));
  beforeEach(inject(function($controller, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    createController = function() {
      return $controller('AdminController');
    };
  }));
  beforeEach(function() {
    $httpBackend.expectGET('/users').respond(users);
  });

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('gets users', function() {
    var vm = createController();
    $httpBackend.flush();
    expect(vm.users).toEqual(users);
  });

  it('has a method that deletes users', function() {
    $httpBackend.expectDELETE('/users/1').respond();
    var vm = createController();
    vm.delete(1);
    $httpBackend.flush();
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
