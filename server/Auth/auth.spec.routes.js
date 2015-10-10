var express = require('express');
var router = express.Router();
var AuthConstructor = require('./auth.service.js');
var Auth = new AuthConstructor(false);

router.get('/isLoggedIn', Auth.isLoggedIn, function(req, res) {
  res.status(200).send('success');
});

router.get('/isAuthorized/:id', Auth.isLoggedIn, function(req, res) {
  if (!Auth.isAuthorized(req.params.id, req.user._id, req, res)) {
    return;
  };
  res.status(200).send('success');
});

router.get('/hasRole', Auth.hasRole('admin'), function(req, res) {
  res.status(200).send('success');
});

module.exports = router;
