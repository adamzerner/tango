var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var AuthConstructor = require('../../Auth/auth.service.js');
var Auth = new AuthConstructor(true);
var bcrypt = require('bcrypt');
var _ = require('lodash');
var schemaFile = require('./user.schema.js');
var User = mongoose.model('User', schemaFile.UserSchema);
var Local = mongoose.model('Local', schemaFile.LocalSchema);
var Facebook = mongoose.model('Facebook', schemaFile.FacebookSchema);
var Twitter = mongoose.model('Twitter', schemaFile.TwitterSchema);
var Google = mongoose.model('Google', schemaFile.GoogleSchema);

function forwardError(res) {
  return function errorForwarder(err) {
    res.status(500).send({ error: err });
  }
}

router.get('/', function(req, res) {
  User.find({}).populate('local facebook twitter google').exec()
    .then(function(users) {
      res.status(200).json(users);
    }, forwardError(res))
  ;
});

router.get('/:id', function(req, res) {
  User.findById(req.params.id).populate('local facebook twitter google').exec()
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      return res.status(200).json(user);
    }, forwardError(res))
  ;
});

router.post('/', function(req, res) {
  // can't manually set the role
  if (req.body.role) {
    return res.status(403).send({ error: "Can't manually set the role of a user." });
  }

  // set admin: going with this approach for the time being. makes it easier to test.
  if (req.body.username === 'admin') {
    req.body.role = 'admin';
  }
  else {
    req.body.role = 'user';
  }

  // hash password
  if (req.body.password) {
    req.body.hashedPassword = bcrypt.hashSync(req.body.password, 8);
    delete req.body.password;
  }
  else {
    return res.status(400).send({ error: 'A password is required.' });
  }

  Local.create(req.body)
    .then(function(local) {
      User.create({ local: local })
        .then(function(user) {
          req.login(user, function(loginErr) {
            if (loginErr) {
              return res.status(500).send({ error: 'Problem logging in after signup.' });
            }
            var userCopy = JSON.parse(JSON.stringify(user));
            delete userCopy.local.hashedPassword;
            return res.status(201).json(userCopy);
          });
        }, forwardError(res))
      ;
    })
    .then(null, function(err) {
      var usernameError = !!(err && err.errors && err.errors.username);
      var usernameNotUnique = ~err.errors.username.message.indexOf('unique');
      var usernameNotPresent = ~err.errors.username.message.indexOf('required');
      if (usernameError && usernameNotUnique) {
        return res.status(409).send({ error: 'Username already exists.' });
      }
      else if (usernameError && usernameNotPresent) {
        return res.status(400).send({ error: 'A username is required.' });
      }
      else {
        return res.status(500).send({ error: err });
      }
    })
  ;
});

router.put('/:id', Auth.isLoggedIn, function(req, res) {
  if (Auth.isAuthorized(req.params.id, req.user._id, req, res)) {
    return;
  }

  // can't manually set the role
  if (req.body.role) {
    return res.status(403).send({ error: "Can't manually set the role of a user." });
  }

  // hash password
  if (req.body.password) {
    req.body.hashedPassword = bcrypt.hashSync(req.body.password, 8);
    delete req.body.password;
  }

  User.findById(req.params.id).exec()
    .then(function(user) {
      Local
        .findByIdAndUpdate(user.local, req.body, { new: true }).exec()
        .then(function(updatedLocal) {
          if (!updatedLocal) {
            return res.status(404).end();
          }
          user.local = updatedLocal;
          return res.status(201).json(user);
        }, forwardError(res))
      ;
    })
    .then(null, function(err) {
      return res.status(404).end();
    })
  ;
});

router.delete('/:id', Auth.isLoggedIn, function(req, res) {
  if (Auth.isAuthorized(req.params.id, req.user._id, req, res)) {
    return;
  }

  User.findByIdAndRemove(req.params.id).exec()
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      if (user.local) {
        Local.findByIdAndRemove(user.local).exec()
          .then(function() {
            if (req.user._id.toString() === req.params.id) {
              req.logout();
            }
            return res.status(204).end();
          }, forwardError(res))
        ;
      }
      else if (user.facebook) {
        Facebook.findByIdAndRemove(user.facebook).exec()
          .then(function() {
            if (req.user._id.toString() === req.params.id) {
              req.logout();
            }
            return res.status(204).end();
          }, forwardError(res))
        ;
      }
      else if (user.twitter) {
        Twitter.findByIdAndRemove(user.twitter).exec()
          .then(function() {
            if (req.user._id.toString() === req.params.id) {
              req.logout();
            }
            return res.status(204).end();
          }, forwardError(res))
        ;
      }
      else if (user.google) {
        Google.findByIdAndRemove(user.google).exec()
          .then(function() {
            if (req.user._id.toString() === req.params.id) {
              req.logout();
            }
            return res.status(204).end();
          }, forwardError(res))
        ;
      }
    }, forwardError(res))
  ;
});

module.exports = router;
