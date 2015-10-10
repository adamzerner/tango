module.exports = function(skipAuth) {
  var mochaUrl = '/usr/local/lib/node_modules/mocha/bin/_mocha';
  var testing = (process.argv[1] === mochaUrl || process.argv[2] === 'mocha');
  skipAuth = skipAuth && testing;

  this.isLoggedIn = function (req, res, next) {
    if (skipAuth) {
      return next();
    }

    if (req.user) {
      return next();
    }
    return res.status(401).send({ error: 'Unauthorized' });
  };

  this.isAuthorized = function (id1, id2, req, res) {
    if (skipAuth) {
      return true;
    }

    var isAuthorized = req.user &&
      (
        req.user.local && req.user.local.role === 'admin' ||
        id1.toString() === id2.toString()
      )
    ;

    if (isAuthorized) {
      return true;
    }

    res.status(401).send({ error: 'Unauthorized '});
    return false;
  };

  this.hasRole = function (roles) {
    // accept a string or an array of strings
    if (typeof roles === 'string') {
      roles = [roles];
    }
    else if (!(roles instanceof 'array')) {
      throw new ReferenceError('Argument must be a string or an array of strings');
    }

    return function (req, res, next) {
      if (skipAuth) {
        return next();
      }

      if (!req.user || !req.user.local || roles.indexOf(req.user.local.role) === -1) {
        return res.status(401).send({ error: 'Unauthorized' });
      }
      return next();
    }
  };
};
