angular
  .module('mean-starter')
  .controller('AdminController', AdminController)
;

function AdminController(User, Auth, $state) {
  var vm = this;
  User
    .list()
    .then(function(data) {
      vm.users = data;
    })
    .catch(function() {
      console.log('Problem getting users.');
    })
  ;

  vm.delete = function(id) {
    User
      .delete(id)
      .then(function(data) {
        if (Auth.getCurrentUser()._id === id) { // deleting yourself
          Auth.logout();
        }
        else {
          $state.reload();
        }
      })
      .catch(function() {
        console.log('Problem deleting user.');
      })
    ;
  };
}
