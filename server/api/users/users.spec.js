var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var agent = request.agent(app);
var invalidId = 'aaaaaaaaaaaaaaaaaaaaaaaa';

describe('Users API (role: user)', function() {
  var id, user1, user2;

  user1 = { username: 'a', password: 'password' }; // logged in
  user2 = { username: 'b', hashedPassword: 'fkjldsafsdafkasdkjfadjksf' };

  beforeEach(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      mongoose.connection.collections['users'].insert(user2, function(err) {
        agent
          .post('/users')
          .send(user1)
          .end(function(err, res) {
            if (err) done(err);
            var result = JSON.parse(res.text);
            id = result._id;
            done();
          });
      });
    });
  });

  after(function(done) { // clear database after tests finished
    mongoose.connection.collections['users'].drop(function(err) {
      done();
    });
  });

  describe('GET /users', function() {
    it('When existing', function(done) {
      agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var users = JSON.parse(res.text);
          assert.equal(users.length, 2);
          assert.equal(users[0].username, user2.username);
          assert(!users[0].hashedPassword);
          assert.equal(users[1]._id, id);
          assert.equal(users[1].username, user1.username);
          assert(!users[1].hashedPassword);
          done();
        });
    });
    it('When empty', function(done) {
      mongoose.connection.collections['users'].drop(function(err) {
        agent
          .get('/users')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            var result = JSON.parse(res.text);
            assert.deepEqual(result, []);
            done();
          });
      });
    });
  });


  describe('GET /users/:id', function() {
    it('Authorized', function(done) {
      agent
        .get('/users/'+id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.username, user1.username);
          assert(!result.hashedPassword);
          done();
        });
    });

    it('Unauthorized', function(done) {
      agent
        .get('/users/'+invalidId)
        .expect(401, done);
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
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert(result._id);
          assert.equal(result.username, 'c');
          assert(!result.hashedPassword);
          done();
        });
    });
    it('Validates required username', function(done) {
      agent
        .post('/users')
        .send({ password: 'password' })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'A username is required.');
          done();
        });
    });
    it('Validates required password', function(done) {
      agent
        .post('/users')
        .send({ username: 'c' })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'A password is required.');
          done();
        });
    });
    it('Validates unique username', function(done) {
      agent
        .post('/users')
        .send({ username: 'a', password: 'password' })
        .expect(409)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'Username already exists.');
          done();
        });
    });
    it('Only adds fields in the schema', function(done) {
      agent
        .post('/users')
        .send({ username: 'c', password: 'password', foo: 'bar' })
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result.username, 'c');
          assert(!result.foo);
          done();
        });
    });
  });

  describe('PUT /users/:id', function() {
    it('Authorized: updates username', function(done) {
      agent
        .put('/users/'+id)
        .send({ username: 'updated' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.username, 'updated');
          assert(!result.hashedPassword);
          done();
        });
    });
    it('Authorized: updates password', function(done) {
      agent
        .put('/users/'+id)
        .send({ username: 'a', password: 'updated' })
        .expect(201, done);
    });
    it('Unauthorized', function(done) {
      agent
        .put('/users/'+invalidId)
        .send({ username: 'updated' })
        .expect(401, done);
    });
  });

  describe('DELETE /users/:id', function() {
    it('Authorized', function(done) {
      agent
        .del('/users/'+id)
        .expect(204, done);
    });
    it('Unauthorized', function(done) {
      agent
        .del('/users/'+invalidId)
        .expect(401, done);
    });
  });

});

describe('Users API (role: admin)', function() {
  var id, user;

  user = {
    username: 'admin',
    password: 'password'
  };

  beforeEach(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      agent
        .post('/users')
        .send(user)
        .end(function(err, res) {
          if (err) done(err);
          var result = JSON.parse(res.text);
          id = result._id;
          done();
        });
    });
  });

  after(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      done();
    });
  });

  describe('GET /users', function() {
    it('When existing', function(done) {
      agent
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text)[0];
          assert.equal(result._id, id);
          assert.equal(result.username, user.username);
          assert(!result.hashedPassword);
          done();
        });
    });
    it('When empty', function(done) {
      mongoose.connection.collections['users'].drop(function(err) {
        agent
          .get('/users')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            var result = JSON.parse(res.text);
            assert.deepEqual(result, []);
            done();
          });
      });
    });
  });


  describe('GET /users/:id', function() {
    it('Valid id', function(done) {
      agent
        .get('/users/'+id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.username, user.username);
          assert(!result.hashedPassword);
          done();
        });
    });

    it('Invalid id', function(done) {
      agent
        .get('/users/'+invalidId)
        .expect(404, done);
    });
  });

  describe('POST /users', function() {
    it('Valid', function(done) {
      agent
        .post('/users')
        .send({ username: 'b', password: 'password' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert(result._id);
          assert.equal(result.username, 'b');
          assert(!result.hashedPassword);
          done();
        });
    });
    it('Validates required username', function(done) {
      agent
        .post('/users')
        .send({ password: 'password' })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'A username is required.');
          done();
        });
    });
    it('Validates required password', function(done) {
      agent
        .post('/users')
        .send({ username: 'c' })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'A password is required.');
          done();
        });
    });
    it('Validates unique username', function(done) {
      agent
        .post('/users')
        .send({ username: 'admin', password: 'password' })
        .expect(409)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'Username already exists.');
          done();
        });
    });
    it('Only adds fields in the schema', function(done) {
      agent
        .post('/users')
        .send({ username: 'b', password: 'password', foo: 'bar' })
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result.username, 'b');
          assert(!result.foo);
          done();
        });
    });
  });

  describe('PUT /users/:id', function() {
    it('Valid: updates username', function(done) {
      agent
        .put('/users/'+id)
        .send({ username: 'updated' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.username, 'updated');
          assert(!result.hashedPassword);
          done();
        });
    });
    it('Valid: updates password', function(done) {
      agent
        .put('/users/'+id)
        .send({ username: 'a', password: 'updated' })
        .expect(201, done);
    });
    it('Invalid id', function(done) {
      agent
        .put('/users/'+invalidId)
        .send({ username: 'updated' })
        .expect(404, done);
    });
  });

  describe('DELETE /users/:id', function() {
    it('Valid id', function(done) {
      agent
        .del('/users/'+id)
        .expect(204, done);
    });
    it('Invalid id', function(done) {
      agent
        .del('/users/'+invalidId)
        .expect(404, done);
    });
  });

});
