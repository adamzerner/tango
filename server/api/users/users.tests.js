var request = require('supertest');
var assert = require('assert');
var mongoose = require('mongoose');
var app = require('../app.js');

describe('Users API', function() {
  var id, user;

  user = {
    username: 'a'
  };

  beforeEach(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      mongoose.connection.collections['users'].insert(user, function(err, docs) {
        id = docs.ops[0]._id;
        done();
      });
    });
  });

  after(function(done) {
    mongoose.connection.collections['users'].drop(function(err) {
      done();
    });
  });

  describe('GET /users', function() { // NOT SHOWING UP FOR SOME REASON
    it('When existing', function(done) {
      request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text)[0];
          assert.equal(result._id, id);
          assert.equal(result.username, user.username);
          done();
        });
    });
    it('When empty', function(done) {
      mongoose.connection.collections['users'].drop(function(err) {
        request(app)
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
      request(app)
        .get('/users/'+id)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result._id, id);
          assert.equal(result.username, user.username);
          done();
        });
    });

    it('Invalid id', function(done) {
      request(app)
        .get('/users/1')
        .expect(404, done);
    });
  });

  describe('POST /users', function() {
    it('Valid', function(done) {
      request(app)
        .post('/users')
        .send({ username: 'b' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result.username, 'b');
          assert(result._id);
          done();
        });
    });
    it('Validates required username', function(done) {
      request(app)
        .post('/users')
        .send({ foo: 'bar' })
        .expect(400)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'A username is required.');
          done();
        });
    });
    it('Validates unique username', function(done) {
      request(app)
        .post('/users')
        .send({ username: 'a' })
        .expect(409)
        .end(function(err, res) {
          if (err) return done(err);
          assert.equal(res.text, 'Username already exists.');
          done();
        });
    });
    it('Only adds fields in the schema', function(done) {
      request(app)
        .post('/users')
        .send({ username: 'b', foo: 'bar' })
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
    it('Valid', function(done) {
      request(app)
        .put('/users/'+id)
        .send({ username: 'updated' })
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) return done(err);
          var result = JSON.parse(res.text);
          assert.equal(result.username, 'updated');
          assert.equal(result._id, id);
          done();
        });
    });
    it('Invalid id', function(done) {
      request(app)
        .put('/users/1')
        .send({ username: 'updated' })
        .expect(404, done);
    });
  });

  describe('DELETE /users/:id', function() {
    it('Valid id', function(done) {
      request(app)
        .del('/users/'+id)
        .expect(204, done);
    });
    it('Invalid id', function(done) {
      request(app)
        .del('/users/1')
        .expect(404, done);
    });
  });

});
