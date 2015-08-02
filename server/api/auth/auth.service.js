function hasRole(role) {
  return function(req, res, next) {
    if (!req.user) res.status(401).send('Unauthorized.');
    else if (req.user.role !== role) res.status(401).send('Unauthorized.');
    else next();
  }
}

function isAuthenticated(req, res, next) {
  if (!req.user) {
    res.status(401).send('Unauthorized.');
  }
  else if (req.user.role !== 'admin' &&
           req.params.id !== req.user._id.toString()) {
    res.status(401).send('Unauthorized.');
  }
  else {
    next();
  }
}

function isLoggedIn(req, res, next) {
  if (req.user) next();
  else res.status(401).send('Unauthorized.');
}

exports.hasRole = hasRole;
exports.isAuthenticated = isAuthenticated;
exports.isLoggedIn = isLoggedIn;
