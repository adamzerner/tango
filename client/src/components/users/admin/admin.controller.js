angular
  .module('mean-starter')
  .controller('AdminController', AdminController)
;

function AdminController(User, Auth, $state) {
  var vm = this;
  User
    .list()
    .success(function(data) {
      vm.users = data;
    })
    .error(function() {
      console.log('Problem getting users.');
    })
  ;

  vm.delete = function(id) {
    User
      .delete(id)
      .success(function(data) {
        if (Auth.getCurrentUser()._id === id) { // deleting yourself
          Auth.logout();
        }
        else {
          $state.reload();
        }
      })
      .error(function() {
        console.log('Problem deleting user.');
      })
    ;
  };
}
