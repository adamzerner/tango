angular
  .module('mean-starter')
  .run(run);

function run($rootScope, Auth, $state) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    if (typeof toState.authenticate !== 'undefined') {
      var currentUser = Auth.getCurrentUser();
      event.preventDefault();
      if (!Auth.isLoggedIn()) {
        alert('Must be logged in to access this route.');
        $state.go('login');
      }
      else if (toState.authenticate.authorized) {
        if (currentUser.role !== 'admin' &&
            currentUser._id.toString() !== toParams.id) {
          alert('You are not authorized to access that route.');
        }
      }
      else if (toState.authenticate.isAdmin) {
        if (currentUser.role !== 'admin') {
          alert('You must be an admin to access this route.');
        }
      }
    }
  });
}
