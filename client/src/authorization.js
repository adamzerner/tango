angular
  .module('tango')
  .run(run)
;

function run($rootScope, Auth, $state) {
  function preventStateChange (message, redirect) {
    if (redirect) {
      $state.go(redirect);
    }
    else {
      $state.go('home');
    }
  }

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
    if (typeof toState.authenticate === 'undefined') { // this route doesn't require permissions
      return;
    }

    Auth
      .getCurrentUser()
      .then(function (currentUser) {
        var isLoggedIn = !!currentUser._id;
        var isAdmin = isLoggedIn && currentUser.local && currentUser.local.role === 'admin';
        var isAuthorized = isLoggedIn && currentUser._id.toString() === toParams.id;

        if (toState.authenticate.loggedOut) { // this route requires you to be logged out
          if (isLoggedIn) {
            preventStateChange("You're logged in.");
          }
        }
        else if (!isLoggedIn) {
          preventStateChange('Must be logged in to access this route.', 'login');
        }
        else if (toState.authenticate.authorized) {
          if (!isAuthorized && !isAdmin) {
            preventStateChange('You are not authorized to access that route.');
          }
        }
        else if (toState.authenticate.admin) {
          if (!isAdmin) {
            preventStateChange('You must be an admin to access this route.');
          }
        }
      })
    ;
  });
}
