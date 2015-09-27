var mongoose = require('mongoose');
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var _ = require('lodash');
var app = require('../../app.js');
var UserSchema = require('../users/user.schema.js').UserSchema;
var User = mongoose.model('User', UserSchema);
var LocalSchema = require('../users/user.schema.js').LocalSchema;
var Local = mongoose.model('Local', LocalSchema);
var TangoSchema = require('./tango.schema.js').TangoSchema;
var Tango = mongoose.model('Tango', TangoSchema);
var agent = request.agent(app);

var testUser, testTangoId, invalidId, testTango;

function removeMongooseFields(obj) {
  delete obj._id;
  delete obj.__v;

  var sims = obj.sims ? obj.sims.length : 0;
  for (var sim = 0; sim < sims; sim++) {
    delete obj.sims[sim]._id;
  }

  var statements = obj.statements ? obj.statements.length : 0;
  for (var statement = 0; statement < statements; statement++) {
    delete obj.statements[statement]._id;
    obj.statements[statement].children.forEach(function(childStatement) {
      removeMongooseFields(childStatement);
    });
  }

  var children = obj.children ? obj.children.length : 0;
  for (var child = 0; child < children; child++) {
    removeMongooseFields(obj.children[child]);
  }
}

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
          .end(callback)
        ;
      }, function(callback) {
        agent
          .post('/tangos')
          .send(testTango)
          .end(function(err, res) {
            var createdTango = JSON.parse(res.text);
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

  describe('GET /tangos', function() {
    it('When existing', function(done) {
      agent
        .get('/tangos')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          assert(!err);
          var tangos = JSON.parse(res.text);
          assert(tangos[0]._id);
          removeMongooseFields(tangos[0]);
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
            assert(!err);
            var tangos = JSON.parse(res.text);
            assert.deepEqual(tangos, []);
            return done();
          })
        ;
      });
    });
  });

  describe('GET /tangos/:id', function() {
    it('Valid id', function(done) {
      agent
        .get('/tangos/'+testTangoId)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          assert(!err);
          var tango = JSON.parse(res.text);
          assert(tango._id);
          removeMongooseFields(tango);
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
          assert(!err);
          var createdTango = JSON.parse(res.text);
          assert(createdTango._id);
          removeMongooseFields(createdTango);
          assert.deepEqual(createdTango, testTango);
          return done();
        })
      ;
    });

    it('No title', function(done) {
      delete testTango.title;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('No sims', function(done) {
      delete testTango.sims;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Empty sims', function(done) {
      testTango.sims = [];

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Sim has no name', function(done) {
      delete testTango.sims[0].name;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Sim\'s name is too long', function(done) {
      testTango.sims[0].name = 'aaaaaa';

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Sim has no description', function(done) {
      delete testTango.sims[0].description;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Sim\'s description is too long', function(done) {
      testTango.sims[0].description = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('No statements', function(done) {
      delete testTango.statements;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Empty statements', function(done) {
      testTango.statements = [];

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Statement has no text', function(done) {
      delete testTango.statements[0].text;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Statement has valid and empty children', function(done) {
      agent
        .post('/tangos')
        .send(testTango)
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var createdTango = JSON.parse(res.text);
          assert(createdTango._id);
          removeMongooseFields(createdTango);
          assert.deepEqual(createdTango, testTango);
          return done();
        })
      ;
    });

    it('Statement has invalid children', function(done) {
      delete testTango.statements[1].children[0].text;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Statement has no focus', function(done) {
      delete testTango.statements[0].focus;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Statement has no childrenHidden', function(done) {
      delete testTango.statements[0].childrenHidden;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });

    it('Statement has no simId', function(done) {
      delete testTango.statements[0].simNumber;

      agent
        .post('/tangos')
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Tango validation failed');
          return done();
        })
      ;
    });
  });

  describe('PUT /tangos/:id', function() {
    it('Invalid id', function(done) {
      agent
        .put('/tangos/' + invalidId)
        .send(testTango)
        .expect(404, done)
      ;
    });

    it('Top level', function(done) {
      testTango.title = 'new title';

      agent
        .put('/tangos/' + testTangoId)
        .send(testTango)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result.title, 'new title');
          return done();
        })
      ;
    });

    it('Sim (valid)', function(done) {
      testTango.sims[0].name = 'a';

      agent
        .put('/tangos/' + testTangoId)
        .send(testTango)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result.sims[0].name, 'a');
          return done();
        })
      ;
    });

    it('Sim (invalid)', function(done) {
      testTango.sims[0].name = 'xxxxxx';

      agent
        .put('/tangos/' + testTangoId)
        .send(testTango)
        .expect(400)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert(result.error);
          assert.equal(result.error, 'Validation failed');
          return done();
        })
      ;
    });

    it('Statement (valid)', function(done) {
      testTango.statements[0].text = 'updated';

      agent
        .put('/tangos/' + testTangoId)
        .send(testTango)
        .expect(201)
        .end(function(err, res) {
          assert(!err);
          var result = JSON.parse(res.text);
          assert.equal(result.statements[0].text, 'updated');
          return done();
        })
      ;
    });

    it('Statement (invalid)', function(done) {
      testTango.statements[0].simNumber = 'foo';

      agent
        .put('/tangos/' + testTangoId)
        .send(testTango)
        .expect(400, done)
      ;
    });
  });

  describe('DELETE /tangos/:id', function() {
    it('Valid id', function(done) {
      agent
        .del('/tangos/' + testTangoId)
        .expect(204, done)
      ;
    });

    it('Invalid id', function(done) {
      agent
        .del('/tangos/' + invalidId)
        .expect(404, done)
      ;
    });
  });
});
