var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var UserSchema = require('../users/user.schema.js').UserSchema;
var LocalSchema = require('../users/user.schema.js').LocalSchema;
var User = mongoose.model('User', UserSchema);
var Local = mongoose.model('Local', LocalSchema);
var agent = request.agent(app);

describe('Auth API', function() {
  var local = {
    username: 'a',
    role: 'user',
    hashedPassword: '$2a$08$7uGRhAW9gbbSCRLb4u/Sou07Zj0PMHwJKNg3NVgRYJVeo/8HE2J8m'
    // password: 'test'
  };
  var user;

  before(function(done) {
    Local.remove({}).exec(function() {
      User.remove({}).exec(function() {
        Local.create(local, function(err, createdLocal) {
          User.create({ local: createdLocal }, function(err, createdUser) {
            user = createdUser;
            done();
          });
        });
      });
    });
  });

  after(function(done) {
    User.remove({}).exec(done);
  });

  it('#current-user when logged out', function(done) {
    agent
      .get('/current-user')
      .expect(200)
      .end(function(err, res) {
        assert(!err);
        assert(!res.text);
        return done();
      })
    ;
  });

  it("Can't log in with wrong username", function(done) {
    agent
      .post('/login')
      .send({ username: 'b', password: 'test' })
      .expect(401, done)
    ;
  });

  it("Can't log in with wrong password", function(done) {
    agent
      .post('/login')
      .send({ username: 'a', password: 'wrong' })
      .expect(401, done)
    ;
  });

  it('Can log in with valid credentials', function(done) {
    agent
      .post('/login')
      .send({ username: 'a', password: 'test' })
      .expect(200)
      .end(function(err, res) {
        assert(!err);
        var result = JSON.parse(res.text);
        assert(result._id);
        assert(result.local);
        assert.equal(result.local.username, user.local.username);
        assert.equal(result.local.role, user.local.role);
        assert(!result.local.hashedPassword);
        return done();
      })
    ;
  });

  it('Can access the current user', function(done) {
    agent
      .get('/current-user')
      .expect(200)
      .end(function(err, res) {
        assert(!err);
        var result = JSON.parse(res.text);
        assert(result._id);
        assert(result.local);
        assert.equal(result.local.username, user.local.username);
        assert.equal(result.local.role, user.local.role);
        assert(!result.local.hashedPassword);
        return done();
      })
    ;
  });

  it('Logout returns a 204', function(done) {
    agent
      .get('/logout')
      .expect(204, done)
    ;
  });

  it('Logout removes user from session', function(done) {
    agent
      .get('/current-user')
      .expect(200)
      .end(function(err, res) {
        assert(!err);
        assert(!res.text);
        return done();
      })
    ;
  });
});
