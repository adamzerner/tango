var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var bcrypt = require('bcrypt');
var config = require('./config.json');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User
      .findById(id).exec()
      .then(function(user) {
        done(null, user);
      }, done)
    ;
  });

  // LOCAL
  passport.use(new LocalStrategy(function(username, password, done) {
    User
      .findOne({ 'local.username': username })
      .select('local')
      .exec()
      .then(function(user) {
        if (!user) {
          return done(null, false);
        }
        var validPassword = bcrypt.compareSync(password, user.local.hashedPassword);
        if (!validPassword) {
          return done(null, false);
        }
        else {
          return done(null, user);
        }
      })
      .then(null, function(err) {
        return done(err);
      })
    ;
  }));

  // FACEBOOK
  passport.use(new FacebookStrategy({
    clientID: config.facebookAuth.clientID,
    clientSecret: config.facebookAuth.clientSecret,
    callbackURL: config.facebookAuth.callbackURL
  }, function(token, refreshToken, profile, done) {
    // asynchronous
    process.nextTick(function() {
      User.findOne({ 'auth.facebookToken': token }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        else {
          var newUser = new User();
          newUser.username = Math.random().toString(); // TODO make username and role required only when using the local strategy
          newUser.isAuthenticatedWith = {};
          newUser.isAuthenticatedWith.facebook = true;
          newUser.auth = {};
          newUser.auth.facebookToken = token;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // TWITTER
  passport.use(new TwitterStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    callbackURL: config.twitterAuth.callbackURL
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'auth.twitterToken': token }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        else {
          var newUser = new User();
          newUser.username = Math.random().toString(); // TODO make username and role required only when using the local strategy
          newUser.isAuthenticatedWith = {};
          newUser.isAuthenticatedWith.twitter = true;
          newUser.auth = {};
          newUser.auth.twitterToken = token;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL
  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'auth.googleToken': token }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }
        else {
          var newUser = new User();
          newUser.username = Math.random().toString();
          newUser.isAuthenticatedWith = {};
          newUser.isAuthenticatedWith.google = true;
          newUser.auth = {};
          newUser.auth.googleToken = token;
          newUser.save(function(err) {
            if (err) {
              throw err;
            }
            return done(null, newUser);
          });
        }
      });
    });
  }));
};
