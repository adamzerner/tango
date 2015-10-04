var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('serve-favicon');
var bcrypt = require('bcrypt');
var uriUtil = require('mongodb-uri');
var app = express();

var config = require('./config/config.js');
var mochaUrl = '/usr/local/lib/node_modules/mocha/bin/_mocha';
var dbUrl;
if (process.env.NODE_ENV === 'production') {
  dbUrl = config.db;
}
else if (process.argv[1] === mochaUrl || process.argv[2] === 'mocha') {
  dbUrl = config.db.test;
}
else {
  dbUrl = config.db.dev;
}
var envFolder = 'src';

mongoose.connect(uriUtil.formatMongoose(dbUrl));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Problem connecting to database.'));
db.once('open', function onDbConnect() {
  console.log('Connected to ' + dbUrl + ' database...');
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
  require('./passport.js')(passport);

  // routes
  app.use('/authTest', require('./Auth/auth.spec.routes.js'));
  app.use('/tangos', require('./api/tangos/tangos.routes.js'));
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
