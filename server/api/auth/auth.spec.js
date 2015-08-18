var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var userSchema = require('../users/user.schema.js');
var User = mongoose.model('User', userSchema);
var app = require('../../app.js');
var agent = request.agent(app);

describe('Auth API', function() {
  var user = {
    username: 'a',
    auth: {
      hashedPassword: '$2a$08$7uGRhAW9gbbSCRLb4u/Sou07Zj0PMHwJKNg3NVgRYJVeo/8HE2J8m'
      // password: 'test'
    }
  };

  before(function(done) {
    User.remove({}).exec(function() {
      User.create(user, done);
    });
  });

  after(function(done) {
    User.remove({}).exec(done);
  });

  it('Starts off with no one logged in', function(done) {
    agent
      .get('/current-user')
      .expect(401, done)
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
        if (err) {
          return done(err);
        }
        var result = JSON.parse(res.text);
        assert.equal(result.username, user.username);
        assert(!result.auth);
        return done();
      })
    ;
  });
  it('Can access the current user', function(done) {
    agent
      .get('/current-user')
      .expect(200)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        var result = JSON.parse(res.text);
        assert.equal(result.username, user.username);
        assert(!result.auth);
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
      .expect(401, done)
    ;
  });
  it("Can't log out if you're not logged in.", function(done) {
    agent
      .get('/logout')
      .expect(401, done)
    ;
  });
});
