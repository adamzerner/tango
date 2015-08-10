function hasRole (roles) {
    if (typeof roles === 'string') {
      roles = [roles];
    }
    else if (!(roles instanceof 'array')) {
      throw new ReferenceError('Argument must be a string or an array of strings');
    }

    return function (req, res, next) {
      if (!req.user || roles.indexOf(req.user.role) === -1) {
        return res.status(401).send('Unauthorized');
      }
      next();
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

  return res.status(401).send('Unauthorized.');
}

function isLoggedIn(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('Unauthorized.');
}

exports.hasRole = hasRole;
exports.isAuthenticated = isAuthenticated;
exports.isLoggedIn = isLoggedIn;
