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

function isAuthorized(req, res, next) {
  var isAuthorized = req.user &&
    (
      req.user.local.role === 'admin' ||
      req.params.id === req.user._id.toString()
    )
  ;

  if (isAuthorized) {
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
exports.isAuthorized = isAuthorized;
exports.isLoggedIn = isLoggedIn;
