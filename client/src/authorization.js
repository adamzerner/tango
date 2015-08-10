angular
  .module('mean-starter')
  .run(run)
;

function run($rootScope, Auth, $state) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    if (typeof toState.authenticate !== 'undefined') {
      var currentUser = Auth.getCurrentUser();
      var admin = currentUser.role === 'admin';
      var authorized = currentUser._id.toString() === toParams.id;
      if (!Auth.isLoggedIn()) {
        event.preventDefault();
        alert('Must be logged in to access this route.');
        $state.go('login');
      }
      else if (toState.authenticate.authorized) {
        if (!admin && !authorized) {
          event.preventDefault();
          alert('You are not authorized to access that route.');
        }
      }
      else if (toState.authenticate.isAdmin) {
        if (!admin) {
          event.preventDefault();
          alert('You must be an admin to access this route.');
        }
      }
    }
  });
}
