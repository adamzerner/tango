var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = require('./user.schema.js');
var User = mongoose.model('User', userSchema);
var Auth = require('../auth/auth.service.js');
var bcrypt = require('bcrypt');

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
    }, forwardError);
});

router.get('/:id', Auth.isAuthenticated, function(req, res) {
  User
    .findById(req.params.id).exec()
    .then(function(user) {
      if (!user) res.status(404).end();
      else res.status(200).json(user);
    }, forwardError);
});

router.post('/', function(req, res) {
  // going with this approach for the time being. makes it easier to test.
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
    res.status(400).send('A password is required.');
  }

  User
    .create(req.body)
    .then(function(user) {
      req.login(user, function(loginErr) {
        if (loginErr) {
          res.status(500).send('Problem logging in after signup.');
        }
        else {
          var userCopy = JSON.parse(JSON.stringify(user));
          delete userCopy.hashedPassword;
          res.status(201).json(userCopy);
        }
      });
    })
    .then(null, function(err) {
      var usernameError = !!err.errors.username;
      var usernameNotUnique = err.errors.username.message.indexOf('unique') > -1;
      var usernameNotPresent = err.errors.username.message.indexOf('required') > -1;
      if (usernameError && usernameNotUnique) {
        res.status(409).send('Username already exists.');
      }
      else if (usernameError && usernameNotPresent) {
        res.status(400).send('A username is required.');
      }
      else {
        res.status(500).send(err);
      }
    });
});

router.put('/:id', Auth.isAuthenticated, function(req, res) {
  User
    .findByIdAndUpdate(req.params.id, req.body, { new: true }).exec() // new sends back updated user
    .then(function(user) {
      if (!user) res.status(404).end()
      else res.status(201).json(user);
    }, forwardError);
});

router.delete('/:id', Auth.isAuthenticated, function(req, res) {
  User
    .findByIdAndRemove(req.params.id).exec()
    .then(function(user) {
      if (!user) res.status(404).end();
      else {
        if (req.user._id.toString() === req.params.id) {
          req.logout();
        }
        res.status(204).end();
      }
    }, forwardError);
});

module.exports = router;
