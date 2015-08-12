angular
  .module('mean-starter')
  .controller('AdminController', AdminController)
;

function AdminController(User, Auth, $state) {
  var vm = this;
  User
    .list()
    .then(function(response) {
      vm.users = response.data;
    })
    .catch(function() {
      console.log('Problem getting users.');
    })
  ;

  vm.delete = function(id) {
    User
      .delete(id)
      .then(function() {
        Auth
          .getCurrentUser()
          .then(function(currentUser) {
            if (currentUser._id === id) { // deleting yourself
              Auth.logout();
            }
            else {
              $state.reload();
            }
          })
        ;
      })
      .catch(function() {
        console.log('Problem deleting user.');
      })
    ;
  };
}
