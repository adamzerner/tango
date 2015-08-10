var mongoose = require('mongoose');
var assert = require('assert');

var request = require('supertest');
var app = require('../../app.js');
var agent = request.agent(app);

describe('Auth API', function() {
  var user = { username: 'a', hashedPassword: '$2a$08$7uGRhAW9gbbSCRLb4u/Sou07Zj0PMHwJKNg3NVgRYJVeo/8HE2J8m' };
  // password: 'test'

  before(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      mongoose.connection.collections['users'].insert(user, done);
    });
  });

  after(function(done) {
    mongoose.connection.collections['users'].drop(done);
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
        assert(!result.hashedPassword);
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
        assert(!result.hashedPassword);
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
