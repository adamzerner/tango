var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var TangoSchema = require('./tango.schema.js').TangoSchema;
var Tango = mongoose.model('Tango', TangoSchema);
var agent = request.agent(app);

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
    describeStr = 'Tangos API (role: user)';
  }
  else if (loggedInUser && loggedInUser.username === 'admin') {
    describeStr = 'Tangos API (role: admin)';
  }
  else {
    describeStr = 'Tangos API (not logged in)';
  }

  describe(describeStr, function() {
    var id, user2;

    var local2 = new Local({
      username: 'b',
      role: 'user',
      hashedPassword: 'sdfjdkslfssdfkjldsfljs'
    });

    beforeEach(function(done) {
      // 1. clear Local and Users
      // 2. create user 2
      // 3. create user 1
      // 4. log user 1 in
      Local.remove({}).exec(function() {
        User.remove({}).exec(function(){
          Local.create(local2, function(err, createdLocal2) {
            User.create({ _id: user2id, local: createdLocal2 }, function(err, createdUser2) {
              user2 = createdUser2;

              if (!loggedInUser) {
                return done();
              }

              agent
                .post('/users')
                .send(loggedInUser)
                .end(function(err, res) {
                  if (err) {
                    return done(err);
                  }
                  var result = JSON.parse(res.text);
                  id = result._id;
                  return done();
                })
              ;

            });
          });
        });
      });
    });

    after(function(done) { // clear database after tests finished
      Local.remove({}).exec(function() {
        User.remove({}).exec(done);
      });
    });

    describe('GET /tangos', function() {

    });

    describe('GET /tangos/:id', function() {

    });

    describe('POST /tangos', function() {

    });

    describe('PUT /tangos/:id', function() {

    });

    describe('DELETE /tangos/:id', function() {

    });

  });
});
