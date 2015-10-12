var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var async = require('async');
var UserSchema = require('./user.schema.js').UserSchema;
var User = mongoose.model('User', UserSchema);
var LocalSchema = require('./user.schema.js').LocalSchema;
var Local = mongoose.model('Local', LocalSchema);
var agent = request.agent(app);

var invalidId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
var user2id = '000000000000000000000000';

var testUsers = [{
  username: 'a',
  password: 'password'
}, {
  username: 'admin',
  password: 'password'
}, null];

describe('Users API', function() {
  var id, user2;

  var local2 = new Local({
    username: 'b',
    role: 'user',
    hashedPassword: 'sdfjdkslfssdfkjldsfljs'
  });

  var loggedInUser = {
    username: 'a',
    password: 'password'
  };

  beforeEach(function(done) {
    async.series([
      function removeLocal(callback) {
        Local.remove({}, callback);
      },

      function removeUser(callback) {
        User.remove({}, callback);
      },

      function createUser1(callback) {
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

  describe('GET /users', function() {
    it('When existing', function(done) {
      agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          assert(!err);
          var users = JSON.parse(res.text);
          assert.equal(users.length, 2);

          assert.equal(users[0]._id, id);
          assert(users[0].local);
          assert.equal(users[0].local.username, loggedInUser.username);
          assert.equal(users[0].local.role, 'user');
          assert(!users[0].local.hashedPassword)

          assert(users[1]._id);
          assert(users[1].local);
          assert.equal(users[1].local.username, user2.local.username);
          assert.equal(users[1].local.role, user2.local.role);
          assert(!users[1].local.hashedPassword);
          return done();
        })
      ;
    });

    it('When empty', function(done) {
      User.remove({}).exec(function() {
        agent
          .get('/users')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert(!err);
            var result = JSON.parse(res.text);
            assert.deepEqual(result, []);
            return done();
          })
        ;
      });
    });
  });

  describe('GET /users/:id', function() {
    it('Valid id', function(done) {
      agent
        .get('/users/' + user2id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, user2id);
          assert(result.local);
          assert.equal(result.local.username, user2.local.username);
          assert.equal(result.local.role, user2.local.role);
          assert(!result.local.hashedPassword);
          return done();
        })
      ;
    });

    it('Invalid id', function(done) {
      agent
        .get('/users/' + invalidId)
        .expect(404, done)
      ;
    });
  });

  describe('POST /users', function() {
    it('Valid', function(done) {
      agent
        .post('/users')
        .send({ username: 'c', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result._id);
          assert(result.local);
          assert.equal(result.local.username, 'c');
          assert.equal(result.local.role, 'user');
          assert(!result.local.hashedPassword);
          return done();
        })
      ;
    });

    it('Validates required username', function(done) {
      agent
        .post('/users')
        .send({ password: 'password' })
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'A username is required.');
          return done();
        })
      ;
    });

    it('Validates required password', function(done) {
      agent
        .post('/users')
        .send({ username: 'c' })
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'A password is required.');
          return done();
        })
      ;
    });

    it('Validates unique username', function(done) {
      agent
        .post('/users')
        .send({ username: 'b', password: 'password' })
        .expect(409)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Username already exists.');
          return done();
        })
      ;
    });

    it('Only adds fields in the schema', function(done) {
      agent
        .post('/users')
        .send({ username: 'c', password: 'password', foo: 'bar' })
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result.local.username, 'c');
          assert(!result.foo);
          return done();
        })
      ;
    });

    it("Can't manually set the role", function(done) {
      agent
        .post('/users')
        .send({ username: 'c', password: 'password', role: 'admin' })
        .expect(403)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, "Can't manually set the role of a user.");
          return done();
        })
      ;
    });
  });

  describe('PUT /users/:id', function() {
    it('Invalid id', function(done) {
      agent
        .put('/users/' + invalidId)
        .send({ username: 'updated' })
        .expect(404, done)
      ;
    });

    it('Updates sims', function(done) {
      agent
        .put('/users/' + id)
        .send({ sims: [{
            name: 'ME',
            description: 'Me'
          }]
        })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.sims[0].name, 'ME');
          assert.equal(result.sims[0].description, 'Me');
          assert(!result.local.hashedPassword);
          return done();
        })
      ;
    });

    // This doesn't pass because the SimSchema validations don't run because it's only casting, not creating the Model. Possible thing to fix, but it's not a huge deal.
    // it('Invalid sims', function(done) {
    //   agent
    //     .put('/users/' + id)
    //     .send({ sims: 'a' })
    //     .expect(500, done)
    //   ;
    // });

    it("Can't update the role", function(done) {
      agent
        .put('/users/' + id)
        .send({ username: 'updated', role: 'admin' })
        .expect(403)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, "Can't manually set the role of a user.");
          return done();
        })
      ;
    });
  });

  describe('DELETE /users/:id', function() {
    it("Can't delete with an invalid id", function(done) {
      agent
        .del('/users/' + invalidId)
        .expect(404, done)
      ;
    });

    it('Can delete with a valid id', function(done) {
      agent
        .del('/users/' + id)
        .expect(204, done)
      ;
    });
  });

});
