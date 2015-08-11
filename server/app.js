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
var bcrypt = require('bcrypt');
var app = express();

var url;
var config = require('./config.json');
var mochaUrl = '/usr/local/lib/node_modules/mocha/bin/_mocha';
if (process.argv[1] === mochaUrl) {
  url = config.db.test;
}
else {
  url = config.db.dev;
}

var envFolder = 'src';

mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Problem connecting to database.'));
db.once('open', function onDbConnect() {
  console.log('Database connection established...');
  // serving web files
  app.use(express.static('client/lib'));
  app.use(express.static('client/' + envFolder));

  // serve favicon
  app.use(favicon(path.resolve(__dirname+'/../client/' + envFolder + '/assets/favicon.ico')));

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
      .findOne({ username: username })
      .select('username hashedPassword')
      .exec()
      .then(function(user) {
        if (!user) {
          return done(null, false);
        }
        var validPassword = bcrypt.compareSync(password, user.hashedPassword);
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

  // routes
  app.use('/users', require('./api/users/users.routes.js'));
  app.use('/', require('./api/auth/auth.routes.js'));

  // serving index.html
  app.get('/*', function(req, res) {
    var url = path.resolve(__dirname + '/../client/' + envFolder + '/index.html');
    res.sendFile(url, null, function(err) {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).end();
    });
  });

  // listening on port 3000
  app.listen(3000, function() {
    console.log('Listening on port 3000...');
  });
});

module.exports = app;
// test
