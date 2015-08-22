var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Local = mongoose.model('Local');
var Facebook = mongoose.model('Facebook');
var Twitter = mongoose.model('Twitter');
var Google = mongoose.model('Google');
var bcrypt = require('bcrypt');
var config = require('./config.json');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User
      .findById(id).populate('local').exec()
      .then(function(user) {
        done(null, user);
      }, done)
    ;
  });

  // LOCAL
  passport.use(new LocalStrategy(function(username, password, done) {
    Local
      .findOne({ username: username })
      .select('username role hashedPassword')
      .exec()
      .then(function(local) {
        if (!local) {
          return done(null, false);
        }
        var validPassword = bcrypt.compareSync(password, local.hashedPassword);
        if (!validPassword) {
          return done(null, false);
        }
        else {
          User
            .findOne({ local: local })
            .populate('local')
            .exec()
            .then(function(user) {
              return done(null, user);
            })
          ;
        }
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
      Facebook
        .findOne({ token: token })
        .select('id token')
        .exec()
        .then(function(facebook) {
          if (facebook) {
            return done(null, facebook);
          }
          Facebook
            .create({ id: profile.id, token: token })
            .then(function(createdFacebook) {
              User
                .create({ facebook: createdFacebook })
                .then(function(user) {
                  return done(null, user);
                })
              ;
            })
          ;
        })
        .then(function(err) {
          return done(err);
        })
      ;
    });
  }));

  // TWITTER
  passport.use(new TwitterStrategy({
    consumerKey: config.twitterAuth.consumerKey,
    consumerSecret: config.twitterAuth.consumerSecret,
    callbackURL: config.twitterAuth.callbackURL
  }, function(token, tokenSecret, profile, done) {
    process.nextTick(function() {
      Twitter
        .findOne({ token: token })
        .select('id token')
        .exec()
        .then(function(twitter) {
          if (twitter) {
            return done(null, twitter);
          }
          Twitter
            .create({ id: profile.id, token: token })
            .then(function(createdTwitter) {
              User
                .create({ twitter: createdTwitter })
                .then(function(user) {
                  return done(null, user);
                })
              ;
            })
          ;
        })
        .then(null, function(err) {
          return done(err);
        })
      ;
    });
  }));

  // GOOGLE
  passport.use(new GoogleStrategy({
    clientID: config.googleAuth.clientID,
    clientSecret: config.googleAuth.clientSecret,
    callbackURL: config.googleAuth.callbackURL
  }, function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      Google
        .findOne({ token: token })
        .select('id token')
        .exec()
        .then(function(google) {
          if (google) {
            return done(null, google);
          }
          Google
            .create({ id: profile.id, token: token })
            .then(function(createdGoogle) {
              User
                .create({ google: createdGoogle })
                .then(function(user) {
                  return done(null, user);
                })
              ;
            })
          ;
        })
        .then(null, function(err) {
          return done(err);
        })
      ;
    });
  }));
};
