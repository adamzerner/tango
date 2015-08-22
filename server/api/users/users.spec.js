var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var app = require('../../app.js');
var User = mongoose.model('User');
var Local = mongoose.model('Local');
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

testUsers.forEach(function(loggedInUser) {
  var describeStr;
  if (loggedInUser && loggedInUser.username === 'a') {
    describeStr = 'Users API (role: user)';
  }
  else if (loggedInUser && loggedInUser.username === 'admin') {
    describeStr = 'Users API (role: admin)';
  }
  else {
    describeStr = 'Users API (not logged in)';
  }

  describe(describeStr, function() {
    var id, user2;

    var local2 = new Local({
      username: 'b',
      role: 'user',
      hashedPassword: 'sdfjdkslfssdfkjldsfljs'
    });

    beforeEach(function(done) {
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

    describe('GET /users', function() {
      it('When existing', function(done) {
        agent
          .get('/users')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            var users = JSON.parse(res.text);
            var expectedUsersLength = loggedInUser ? 2 : 1;
            assert.equal(users.length, expectedUsersLength);
            assert(users[0]._id);
            assert(users[0].local);
            assert.equal(users[0].local.username, user2.local.username);
            assert.equal(users[0].local.role, user2.local.role);
            assert(!users[0].local.hashedPassword)
            if (loggedInUser) {
              assert.equal(users[1]._id, id);
              assert(users[1].local);
              assert.equal(users[1].local.username, loggedInUser.username);
              if (loggedInUser.username === 'a') {
                assert.equal(users[1].local.role, 'user');
              }
              else if (loggedInUser.username === 'admin') {
                assert.equal(users[1].local.role, 'admin');
              }
              assert(!users[1].local.hashedPassword);
            }
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
              if (err) {
                return done(err);
              }
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
          .get('/users/'+user2id)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
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
          .get('/users/'+invalidId)
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
            if (err) {
              return done(err);
            }
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
            if (err) {
              return done(err);
            }
            assert.equal(res.text, 'A username is required.');
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
            if (err) {
              return done(err);
            }
            assert.equal(res.text, 'A password is required.');
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
            if (err) {
              return done(err);
            }
            assert.equal(res.text, 'Username already exists.');
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
            if (err) {
              return done(err);
            }
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
            if (err) {
              return done(err);
            }
            assert.equal(res.text, "Can't manually set the role of a user.");
            return done();
          })
        ;
      });
    });

    describe('PUT /users/:id', function() {
      /*
      - all
        - invalid id
      - user + admin
        - update yourself
      - user + not logged in
        - can't update someone else
      - admin
        - can update someone else
      */

      it('Invalid id', function(done) {
        var expectedResponseCode;
        if (loggedInUser && loggedInUser.username === 'admin') {
          expectedResponseCode = 404;
        }
        else  {
          expectedResponseCode = 401;
        }
        agent
          .put('/users/'+invalidId)
          .send({ username: 'updated' })
          .expect(expectedResponseCode, done)
        ;
      });

      if (loggedInUser) {
        it('Yourself: updates username', function(done) {
          agent
            .put('/users/'+id)
            .send({ username: 'updated' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var result = JSON.parse(res.text);
              assert.equal(result._id, id);
              assert(result.local);
              assert.equal(result.local.username, 'updated');
              if (loggedInUser.username === 'a') {
                assert.equal(result.local.role, 'user');
              }
              else if (loggedInUser.username === 'admin') {
                assert.equal(result.local.role, 'admin');
              }
              assert(!result.local.hashedPassword);
              return done();
            })
          ;
        });
        it('Yourself: updates password', function(done) {
          agent
            .put('/users/'+id)
            .send({ password: 'updated' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var result = JSON.parse(res.text);
              assert.equal(result._id, id);
              assert(result.local);
              assert.equal(result.local.username, loggedInUser.username);
              if (loggedInUser.username === 'a') {
                assert.equal(result.local.role, 'user');
              }
              else {
                assert.equal(result.local.role, 'admin');
              }
              assert(!result.local.hashedPassword);
              return done();
            })
          ;
        });
        it("Yourself: can't update the role", function(done) {
          agent
            .put('/users/'+id)
            .send({ username: 'updated', role: 'admin' })
            .expect(403)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              assert.equal(res.text, "Can't manually set the role of a user.");
              return done();
            })
          ;
        });
      }

      if (loggedInUser && loggedInUser.username === 'admin') {
        it('Admin can update others', function(done) {
          agent
            .put('/users/'+user2id)
            .send({ username: 'updated' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              if (err) {
                return done(err);
              }
              var result = JSON.parse(res.text);
              assert.equal(result._id, user2id);
              assert(result.local);
              assert.equal(result.local.username, 'updated');
              assert.equal(result.local.role, 'user');
              assert(!result.local.hashedPassword);
              return done();
            })
          ;
        });
      }

      else { // not admin
        it("Non-admins can't update others", function(done) {
          agent
            .put('/users/'+user2id)
            .send({ username: 'updated' })
            .expect(401, done)
          ;
        });
      }
    });

    describe('DELETE /users/:id', function() {
      it("Can't delete with an invalid id", function(done) {
        var expectedResponseCode;
        if (loggedInUser && loggedInUser.username === 'admin') {
          expectedResponseCode = 404;
        }
        else  {
          expectedResponseCode = 401;
        }
        agent
          .del('/users/'+invalidId)
          .expect(expectedResponseCode, done)
        ;
      });
      if (loggedInUser) {
        it('Can delete yourself when logged in', function(done) {
          agent
            .del('/users/'+id)
            .expect(204, done)
          ;
        });
      }
      if (loggedInUser && loggedInUser.username === 'admin') {
        it('Admin can delete others', function(done) {
          agent
            .del('/users/'+user2id)
            .expect(204, done)
          ;
        });
      }
      else {
        it("Non-admins can't delete others", function(done) {
          agent
            .del('/users/'+user2id)
            .expect(401, done)
          ;
        });
      }
    });

  });
});
