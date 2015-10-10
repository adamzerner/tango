angular
  .module('tango')
  .run(run)
;

function run($rootScope, Auth, $state, Tango) {
  function redirect (message, state) {
    alert(message);
    if (state) {
      $state.go(state);
    }
    else {
      $state.go('home');
    }
  }

  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
    if (typeof toState.authenticate === 'undefined') { // this route doesn't require permissions
      return;
    }

    Auth.getCurrentUser()
      .then(function (currentUser) {
        var isLoggedIn = !!currentUser._id;
        var isAdmin = isLoggedIn && currentUser.local && currentUser.local.role === 'admin';

        if (toState.authenticate.loggedOut) { // this route requires you to be logged out
          if (isLoggedIn) {
            redirect("You're logged in.");
          }
        }
        else if (!isLoggedIn) {
          redirect('Must be logged in to access this route.');
        }
        else if (toState.authenticate.authorized) {
          // set isAuthorized based on user/tango
          var isAuthorized;
          if (toState.authenticate.authorized === 'user') {
            isAuthorized = toParams.id === currentUser._id.toString();

            if (!isAuthorized && !isAdmin) {
              redirect('You are not authorized to access that route.');
            }
          }
          else if (toState.authenticate.authorized === 'tango') {
            Tango
              .get(toParams.id)
              .then(function(response) {
                isAuthorized = response.data.author === currentUser._id.toString();

                if (!isAuthorized && !isAdmin) {
                  redirect('You are not authorized to access that route.');
                }
              })
              .catch(function(response) {
                if (!isAuthorized) {
                  redirect('You are not authorized to access that route.');
                }
              })
            ;
          }
        }
        else if (toState.authenticate.admin) {
          if (!isAdmin) {
            redirect('You must be an admin to access this route.');
          }
        }
      })
    ;
  });
}
