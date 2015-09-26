var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Auth = require('../../Auth/auth.service.js');
var UserSchema = require('../users/user.schema.js').UserSchema;
var User = mongoose.model('User', UserSchema);
var TangoSchema = require('./tango.schema.js').TangoSchema;
var Tango = mongoose.model('Tango', TangoSchema);

function forwardError(res) {
  return function errorForwarder(err) {
    res.status(500).send({ error: err.message });
  }
}

router.get('/', Auth.hasRole('admin'), function(req, res) {
  Tango.find({}).exec()
    .then(function(tangos) {
      res.status(200).json(tangos);
    }, forwardError(res))
  ;
});

router.get('/:id', Auth.isAuthorized, function(req, res) {
  Tango.findById(req.params.id).exec()
    .then(function(tango) {
      if (!tango) {
        return res.status(404).end();
      }
      return res.status(200).json(tango);
    }, forwardError(res))
  ;
});

router.post('/', Auth.isLoggedIn, function(req, res) {
  // 1. Create Tango
  // 2. Find current user
  // 3. Add tango to current user
  // 4. Save current user
  Tango.create(req.body)
    .then(function(createdTango) {
      User.findById(req.user._id).exec()
        .then(function(currentUser) {
          currentUser.tangos.push(createdTango);
          currentUser.save(function(err) {
            if (err) {
              return res.status(500).send({ error: err.message });
            }
            return res.status(201).json(createdTango);
          });
        }, forwardError(res))
      ;
    })
    .then(null, function(err) { // invalid tango
      res.status(400).send({ error: err.message });
    });
  ;
});

router.put('/:id', Auth.isAuthorized, function(req, res) {
  Tango.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).exec()
    .then(function(tango) {
      if (!tango) {
        return res.status(404).end();
      }
      return res.status(201).json(tango);
    })
    .then(null, function(err) { // invalid tango
      res.status(400).send({ error: err.message });
    });
  ;
});

router.delete('/:id', Auth.isAuthorized, function(req, res) {
  // 1. Remove tango
  // 2. Find current user
  // 3. Remove tango from current user
  // 4. Save current user
  Tango.findByIdAndRemove(req.params.id).exec()
    .then(function(removedTango) {
      if (!removedTango) {
        return res.status(404).end();
      }
      User.findById(req.user._id).exec()
        .then(function(currentUser) {
          var index = currentUser.tangos.indexOf(removedTango);
          currentUser.tangos.splice(index, 1);
          currentUser.save(function(err) {
            if (err) {
              return res.status(500).send({ error: err });
            }
            res.status(204).end();
          });
        }, forwardError(res))
      ;
    }, forwardError(res))
  ;
});

module.exports = router;
