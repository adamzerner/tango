var express = require('express');
var passport = require('passport');
var Auth = require('./auth.service.js');
var router = express.Router();

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.status(200).json(req.user);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(204).end();
});

router.get('/current-user', Auth.isLoggedIn, function(req, res) {
  res.status(200).json(req.user);
});

module.exports = router;
