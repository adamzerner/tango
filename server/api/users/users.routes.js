var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var User = mongoose.model('User');
var Local = mongoose.model('Local');
var Auth = require('../auth/auth.service.js');
var bcrypt = require('bcrypt');

function forwardError(res) {
  return function errorForwarder(err) {
    res.status(500).send(err);
  }
}

router.get('/', function(req, res) {
  User
    .find({}).populate('local').exec()
    .then(function(users) {
      res.status(200).json(users);
    }, forwardError)
  ;
});

router.get('/:id', function(req, res) {
  User
    .findById(req.params.id).populate('local').exec()
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      return res.status(200).json(user);
    }, forwardError)
  ;
});

router.post('/', function(req, res) {
  // can't manually set the role
  if (req.body.role) {
    return res.status(403).send("Can't manually set the role of a user.");
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
    return res.status(400).send('A password is required.');
  }

  Local
    .create(req.body)
    .then(function(local) {
      var userToCreate = {
        local: local
      };
      User
        .create(userToCreate)
        .then(function(user) {
          req.login(user, function(loginErr) {
            if (loginErr) {
              return res.status(500).send('Problem logging in after signup.');
            }
            var userCopy = JSON.parse(JSON.stringify(user));
            delete userCopy.local.hashedPassword;
            return res.status(201).json(userCopy);
          });
        })
        .then(null, function(err) {
        })
      ;
    })
    .then(null, function(err) {
      var usernameError = !!(err && err.errors && err.errors.username);
      var usernameNotUnique = ~err.errors.username.message.indexOf('unique');
      var usernameNotPresent = ~err.errors.username.message.indexOf('required');
      if (usernameError && usernameNotUnique) {
        return res.status(409).send('Username already exists.');
      }
      else if (usernameError && usernameNotPresent) {
        return res.status(400).send('A username is required.');
      }
      else {
        return res.status(500).send(err);
      }
    })
  ;
});

router.put('/:id', Auth.isAuthorized, function(req, res) {
  // can't manually set the role
  if (req.body.role) {
    return res.status(403).send("Can't manually set the role of a user.");
  }

  // hash password
  if (req.body.password) {
    req.body.hashedPassword = bcrypt.hashSync(req.body.password, 8);
    delete req.body.password;
  }

  User
    .findById(req.params.id).exec()
    .then(function(user) {
      Local
        .findByIdAndUpdate(user.local, req.body, { new: true }).exec()
        .then(function(updatedLocal) {
          if (!updatedLocal) {
            return res.status(404).end();
          }
          user.local = updatedLocal;
          return res.status(201).json(user);
        })
        .then(null, function(err) {
          console.log('problem updating local: ', err);
        })
      ;
    })
  ;
});

router.delete('/:id', Auth.isAuthorized, function(req, res) {
  User
    .findByIdAndRemove(req.params.id).exec()
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      if (req.user._id.toString() === req.params.id) {
        req.logout();
      }
      return res.status(204).end();
    }, forwardError)
  ;
});

module.exports = router;
