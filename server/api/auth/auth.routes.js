var express = require('express');
var passport = require('passport');
var Auth = require('./auth.service.js');
var router = express.Router();

// LOCAL
router.post('/login', passport.authenticate('local'), function(req, res) {
  var userCopy = JSON.parse(JSON.stringify(req.user));
  delete userCopy.auth;
  res.status(200).json(userCopy);
});

router.get('/logout', Auth.isLoggedIn, function(req, res) {
  req.logout();
  res.status(204).end();
});

router.get('/current-user', Auth.isLoggedIn, function(req, res) {
  res.status(200).json(req.user);
});

// FACEBOOK
router.get('/auth/facebook', function() {
  console.log('Hits /auth/facebook');
}, passport.authenticate('facebook'));

router.get('/auth/facebook/callback', function() {
    console.log('Hits /auth/facebook/callback');
  },
  passport.authenticate('facebook', {
		successRedirect: '/signup',
		failureRedirect: '/login'
	})
);

module.exports = router;
