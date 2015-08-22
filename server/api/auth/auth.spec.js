var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var User = mongoose.model('User');
var Local = mongoose.model('Local');
var agent = request.agent(app);
// try {
// }
// catch(e) { // :( https://github.com/Automattic/mongoose/issues/1251
//   var schemas = require('../users/user.model.js');
//   var User = mongoose.model('User', schemas.UserSchema);
//   var Local = mongoose.model('Local', schemas.LocalSchema);
// }

describe('Auth API', function() {
  var local = {
    username: 'a',
    role: 'user',
    hashedPassword: '$2a$08$7uGRhAW9gbbSCRLb4u/Sou07Zj0PMHwJKNg3NVgRYJVeo/8HE2J8m'
    // password: 'test'
  };
  var user = { local: local };

  before(function(done) {
    Local.remove({}).exec(function() {
      User.remove({}).exec(function() {
        Local.create(local, function(createdLocal) {
          User.create({ local: createdLocal }, done);
        });
      })
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
        if (err) {
          return done(err);
        }
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
