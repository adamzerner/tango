var express = require('express');
var mongoose = require('mongoose');
var router = express.Router();
var userSchema = require('./user.schema.js');
var User = mongoose.model('User', userSchema);

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
      res.status(500).send(err);
    });
});

router.post('/', function(req, res) {
  User
    .create(req.body)
    .then(function(user) {
      res.status(201).json(user);
    })
    .then(null, function(err) {
      res.status(500).send(err);
    });
});

router.put('/:id', function(req, res) {
  User
    .findByIdAndUpdate(req.params.id, req.body).exec()
    .then(function(user) {
      res.status(201).json(user);
    })
    .then(null, function(err) {
      res.status(500).send(err);
    });
});

router.delete('/:id', function(req, res) {
  User
    .findByIdAndRemove(req.params.id).exec()
    .then(function() {
      res.status(204).end();
    })
    .then(null, function(err) {
      res.status(500).send(err);
    });
});

router.clear('/clear', function(req, res) {
  User
    .remove({}).exec()
    .then(function() {
      res.status(204).end();
    })
    .then(null, function(err) {
      res.status(500).send(err);
    });
});

module.exports = router;
