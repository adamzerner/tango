var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var app = require('../../app.js');
var UserSchema = require('../users/user.schema.js').UserSchema;
var User = mongoose.model('User', UserSchema);
var LocalSchema = require('../users/user.schema.js').LocalSchema;
var Local = mongoose.model('Local', LocalSchema);
var TangoSchema = require('./tango.schema.js').TangoSchema;
var Tango = mongoose.model('Tango', TangoSchema);
var agent = request.agent(app);

var testUser, testTangoId, invalidId, testTango;

describe('Tangos API:', function() {
  beforeEach(function(done) {
    testUser = {
      username: 'a',
      password: 'password'
    };

    invalidId = 'aaaaaaaaaaaaaaaaaaaaaaaa';
    testTango = {
      title: 'title',
      sims: [{
        name: 'A',
        description: 'A description'
      }, {
        name: 'B',
        description: 'B description'
      }, {
        name: 'C',
        description: 'C description'
      }],
      statements: [{
        text: '1',
        children: [],
        focus: false,
        childrenHidden: false,
        simNumber: 1
      }, {
        text: '2',
        children: [{
          text: '2.1',
          children: [],
          focus: false,
          childrenHidden: false,
          simNumber: 3
        }],
        focus: false,
        childrenHidden: false,
        simNumber: 2
      }]
    };

    async.series([
      function(callback) {
        agent
          .post('/users')
          .send(testUser)
          .end(function(err, res) {
            callback();
          })
        ;
      }, function(callback) {
        agent
          .post('/tangos')
          .send(testTango)
          .end(function(err, res) {
            var createdTango = JSON.parse(res.text);
            console.log('createdTango: ', createdTango);
            testTangoId = createdTango._id;
            callback();
          })
        ;
      }
    ], done);
  });

  afterEach(function(done) { // clear database after tests finished
    Local.remove({}).exec(function() {
      User.remove({}).exec(function() {
        Tango.remove({}).exec(done);
      });
    });
  });

  xdescribe('GET /tangos', function() {
    it('When existing', function(done) {
      agent
        .get('/tangos')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var tangos = JSON.parse(res.text);
          delete tangos[0]._id; // these fields are added by mongoose and aren't part of my test document
          delete tangos[0].__v;
          assert.deepEqual(tangos[0], testTango);
          return done();
        })
      ;
    });

    it('When empty', function(done) {
      Tango.remove({}).exec(function() {
        agent
          .get('/tangos')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            var tangos = JSON.parse(res.text);
            assert.deepEqual(tangos, []);
            return done();
          })
        ;
      });
    });
  });

  xdescribe('GET /tangos/:id', function() {
    it('Valid id', function(done) {
      agent
        .get('/tangos/'+testTangoId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var tango = JSON.parse(res.text);
          delete tango._id;
          delete tango.__v;
          assert.deepEqual(tango, testTango);
          return done();
        })
      ;
    });

    it('Invalid id', function(done) {
      agent
        .get('/tangos/'+invalidId)
        .expect(404, done)
      ;
    });
  });

  describe('POST /tangos', function() {
    it('Valid', function(done) {
      agent
        .post('/tangos')
        .send(testTango)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var createdTango = JSON.parse(res.text);
          delete createdTango._id;
          delete createdTango.__v;
          assert.deepEqual(createdTango, testTango);
          return done();
        })
      ;
    });
    xit('No title', function(done) {
      delete testTango.title;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('No sims', function(done) {
      delete testTango.sims;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('Empty sims', function(done) {
      testTango.sims = [];

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('Sim has no name', function(done) {
      delete testTango.sims[0].name;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('Sim\'s name is too long', function(done) {

    });
    xit('Sim has no description', function(done) {

    });
    xit('Sim\'s description is too long', function(done) {

    });
    xit('No statements', function(done) {
      delete testTango.statements;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('Empty statements', function(done) {
      testTango.statements = [];

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          done();
        })
      ;
    });
    xit('Statement has no text', function(done) {

    });
    xit('Statement has no children', function(done) {

    });
    xit('Statement\'s children are empty', function(done) {

    });
    xit('Statement has no focus', function(done) {

    });
    xit('Statement has no childrenHidden', function(done) {

    });
    xit('Statement has no simId', function(done) {

    });
  });

  // describe('PUT /tangos/:id', function() {
  //
  // });
  //
  // describe('DELETE /tangos/:id', function() {
  //
  // });

});
