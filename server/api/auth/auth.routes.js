var express = require('express');
var passport = require('passport');
var Auth = require('./auth.service.js');
var router = express.Router();

router.post('/login', passport.authenticate('local'), function(req, res) {
  var userCopy = JSON.parse(JSON.stringify(req.user));
  delete userCopy.hashedPassword;
  res.status(200).json(userCopy);
});

router.get('/logout', Auth.isLoggedIn, function(req, res) {
  req.logout();
  res.status(204).end();
});

router.get('/current-user', Auth.isLoggedIn, function(req, res) {
  res.status(200).json(req.user);
});

module.exports = router;
