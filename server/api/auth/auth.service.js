function hasRole() {
  // if the user passes in a role
  if (typeof arguments[0] === 'string') {
    var role = arguments[0];
    return function(req, res, next) {
      if (!req.user) {
        res.status(401).send('Unauthorized.');
      }
      else if (req.user.role !== role) {
        res.status(401).send('Unauthorized.');
      }
      else {
        next();
      }
    }
  }
  // if the user passes in an array of roles
  else if (typeof arguments[0] === 'object') {
    var roles = arguments[0];
    return function(req, res, next) {
      if (!req.user) {
        res.status(401).send('Unauthorized.');
      }
      else if (roles.indexOf(req.user.role) === -1) {
        res.status(401).send('Unauthorized');
      }
      else {
        next();
      }
    }
  }
}

function isAuthenticated(req, res, next) {
  var isAuthenticated = req.user &&
    (
      req.user.role === 'admin' ||
      req.params.id === req.user._id.toString()
    )
  ;

  if (isAuthenticated) {
      return next();
  }

  res.status(401).send('Unauthorized.');
}

function isLoggedIn(req, res, next) {
  if (req.user) next();
  else res.status(401).send('Unauthorized.');
}

exports.hasRole = hasRole;
exports.isAuthenticated = isAuthenticated;
exports.isLoggedIn = isLoggedIn;
