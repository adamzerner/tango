var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = require('./user.schema.js');
var User = mongoose.model('User', userSchema);
var Auth = require('../auth/auth.service.js');

router.get('/', function(req, res) {
  User
    .find({}).exec()
    .then(function(users) {
      res.status(200).json(users);
    })
    .then(null, function(err) {
      res.status(500).send(err);
    });
});

router.get('/:id', function(req, res) {
  User
    .findById(req.params.id).exec()
    .then(function(user) {
      res.status(200).json(user);
    })
    .then(null, function(err) {
      res.status(404).send(err);
    });
});

router.post('/', function(req, res) {
  if (req.body.username === 'adamzerner') {
    req.body.role = 'admin';
  }
  else {
    req.body.role = 'user';
  }

  User
    .create(req.body)
    .then(function(user) {
      req.login(user, function(loginErr) {
        if (loginErr) res.status(500).send('Problem logging in after signup.');
        else res.status(201).json(user);
      });
    })
    .then(null, function(err) {
      var message = err.errors.username.message;
      if (message.indexOf('unique') > -1) {
        res.status(409).send('Username already exists.');
      }
      else if (message.indexOf('required') > -1) {
        res.status(400).send('A username is required.');
      }
      else {
        res.status(500).send(err);
      }
    });
});

router.put('/:id', function(req, res) {
  User
    .findByIdAndUpdate(req.params.id, req.body, { new: true }).exec()
    .then(function(user) {
      res.status(201).json(user);
    })
    .then(null, function(err) {
      res.status(404).send(err);
    });
});

router.delete('/:id', function(req, res) {
  User
    .findByIdAndRemove(req.params.id).exec()
    .then(function() {
      if (req.user._id.toString() === req.params.id) {
        req.logout();
      }
      res.status(204).end();
    })
    .then(null, function(err) {
      res.status(404).send(err);
    });
});

module.exports = router;
