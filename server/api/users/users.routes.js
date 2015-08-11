var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = require('./user.schema.js');
var User = mongoose.model('User', userSchema);
var Auth = require('../auth/auth.service.js');
var bcrypt = require('bcrypt');
var _ = require('lodash');

function forwardError(res) {
  return function errorForwarder(err) {
    res.status(500).send(err);
  }
}

router.get('/', function(req, res) {
  User
    .find({}).exec()
    .then(function(users) {
      res.status(200).json(users);
    }, forwardError)
  ;
});

router.get('/:id', Auth.isAuthenticated, function(req, res) {
  User
    .findById(req.params.id).exec()
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      return res.status(200).json(user);
    }, forwardError)
  ;
});

router.post('/', function(req, res) {
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
  }
  else {
    return res.status(400).send('A password is required.');
  }

  User
    .create(req.body)
    .then(function(user) {
      req.login(user, function(loginErr) {
        if (loginErr) {
          return res.status(500).send('Problem logging in after signup.');
        }
        var userCopy = _.cloneDeep(user);
        delete userCopy.hashedPassword;
        return res.status(201).json(userCopy);
      });
    })
    .then(null, function(err) {
      var usernameError = !!err.errors.username;
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
    });
});

router.put('/:id', Auth.isAuthenticated, function(req, res) {
  if (req.body.password) {
    req.body.hashedPassword = bcrypt.hashSync(req.body.password, 8);
  }

  User
    .findByIdAndUpdate(req.params.id, req.body, { new: true }).exec() // new sends back updated user
    .then(function(user) {
      if (!user) {
        return res.status(404).end()
      }
      return res.status(201).json(user);
    }, forwardError)
  ;
});

router.delete('/:id', Auth.isAuthenticated, function(req, res) {
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
