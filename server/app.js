var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var userSchema = require('./api/users/user.schema.js');
var User = mongoose.model('User', userSchema);
var app = express();

var url;
var config = require('./config.json');
if (process.argv[1] === '/usr/local/lib/node_modules/mocha/bin/_mocha') {
  url = config.db.test;
}
else {
  url = config.db.dev;
}

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Problem connecting to database.'));
db.once('open', function onDbConnect() {
  console.log('Database connection established...');
  // serving web files
  app.use(express.static('client'));

  // serve favicon
  app.use(favicon(path.resolve(__dirname+'/../client/assets/favicon.ico')));

  // basic middleware
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(expressSession({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
  }));

  // configuring passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new passportLocal.Strategy(function(username, password, done) {
    User
      .findOne({ username: username }).exec()
      .then(function(user) {
        if (!user) done(null, false);
        done(null, user);
      })
      .then(null, function(err) {
        done(err);
      });
  }));
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  passport.deserializeUser(function(id, done) {
    User
      .findById(id).exec()
      .then(function(user) {
        done(null, user);
      })
      .then(null, function(err) {
        done(err);
      });
  });

  // routes
  app.use('/users', require('./api/users/users.routes.js'));
  app.use('/', require('./api/auth/auth.routes.js'));

  // serving index.html
  app.get('/*', function(req, res) {
    var url = path.resolve(__dirname + '/../client/index.html');
    res.sendFile(url, null, function(err) {
      if (err) res.status(500).send(err);
      else res.status(200).end();
    });
  });

  // listening on port 3000
  app.listen(3000, function() {
    console.log('Listening on port 3000...');
  });
});

module.exports = app;
