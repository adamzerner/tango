var mongoose = require('mongoose');
var assert = require('assert');
var AuthConstructor = require('./auth.service.js');
var Auth = new AuthConstructor(false);
var app = require('../app.js');
var request = require('supertest');
var async = require('async');
var UserSchema = require('../api/users/user.schema.js').UserSchema;
var User = mongoose.model('User', UserSchema);
var LocalSchema = require('../api/users/user.schema.js').LocalSchema;
var Local = mongoose.model('Local', LocalSchema);
var agent = request.agent(app);

var user2id = '000000000000000000000000';
var testUsers = [{
  username: 'a',
  password: 'password'
}, {
  username: 'admin',
  password: 'password'
}, null];

testUsers.forEach(function(loggedInUser) {
  var describeStr;
  if (loggedInUser && loggedInUser.username === 'a') {
    describeStr = 'Auth Service (role: user)';
  }
  else if (loggedInUser && loggedInUser.username === 'admin') {
    describeStr = 'Auth Service (role: admin)';
  }
  else {
    describeStr = 'Auth Service (not logged in)';
  }

  describe(describeStr, function() {
    var id, user2;

    var local2 = new Local({
      username: 'b',
      role: 'user',
      hashedPassword: 'sdfjdkslfssdfkjldsfljs'
    });

    beforeEach(function(done) {
      async.series([
        function removeLocal(callback) {
          Local.remove({}, callback);
        },

        function removeUser(callback) {
          User.remove({}, callback);
        },

        function createUser1(callback) {
          if (!loggedInUser) {
            return callback();
          }

          agent
            .post('/users')
            .send(loggedInUser)
            .end(function(err, res) {
              assert(!err);
              var result = JSON.parse(res.text);
              id = result._id;
              return callback();
            })
          ;
        },

        function createUser2(callback) {
          Local.create(local2, function(err, createdLocal2) {
            User.create({ _id: user2id, local: createdLocal2 }, function(err, createdUser2) {
              user2 = createdUser2;
              callback();
            });
          });
        }
      ], done);
    });

    after(function(done) { // clear database after tests finished
      Local.remove({}).exec(function() {
        User.remove({}).exec(done);
      });
    });

    it('#isLoggedIn', function(done) {
      if (loggedInUser) {
        agent
          .get('/authTest/isLoggedIn')
          .expect(200, done)
        ;
      }
      else {
        agent
          .get('/authTest/isLoggedIn')
          .expect(401)
          .end(function(err, res) {
            assert(!err);
            var response = JSON.parse(res.text);
            assert.equal(response.error, 'Unauthorized');
            return done();
          })
        ;
      }
    });

    it('#isAuthorized', function(done) {
      if (loggedInUser && loggedInUser.username === 'admin') {
        agent
          .get('/authTest/isAuthorized/' + user2id)
          .expect(200, done)
        ;
      }
      else if (loggedInUser && loggedInUser.username === 'a') {
        async.series([
          function(callback) {
            agent
              .get('/authTest/isAuthorized/' + user2id)
              .expect(401, callback)
            ;
          }, function(callback) {
            agent
              .get('/authTest/isAuthorized/' + id)
              .expect(200, callback)
            ;
          }
        ], done);
      }
      else if (!loggedInUser) {
        agent
          .get('/authTest/isAuthorized/' + user2id)
          .expect(401, done)
        ;
      }
    });

    it('#hasRole', function(done) {
      if (loggedInUser && loggedInUser.username === 'admin') {
        agent
          .get('/authTest/hasRole')
          .expect(200, done)
        ;
      }
      else {
        agent
          .get('/authTest/hasRole')
          .expect(401, done)
        ;
      }
    });
  });
});
