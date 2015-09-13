var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var autopopulate = require('mongoose-autopopulate');
var ObjectId = Schema.Types.ObjectId;
var schemaFile = require('../tango.schema.js');
var TangoSchema = schemaFile.TangoSchema;
var SimSchema = schemaFile.SimSchema;

var UserSchema = new Schema({
  local: { type: ObjectId, ref: 'Local' },
  facebook: { type: ObjectId, ref: 'Facebook', autopopulate: true },
  twitter: { type: ObjectId, ref: 'Twitter', autopopulate: true },
  google: { type: ObjectId, ref: 'Google', autopopulate: true },
  tangos: { type: [TangoSchema] },
  sims: { type: [SimSchema] }
}).plugin(autopopulate);

var LocalSchema = new Schema({
  username: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['user', 'admin'] },
  hashedPassword: { type: String, required: true, select: false }
}).plugin(uniqueValidator);

var FacebookSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

var TwitterSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

var GoogleSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

exports.UserSchema = UserSchema;
exports.LocalSchema = LocalSchema;
exports.FacebookSchema = FacebookSchema;
exports.TwitterSchema = TwitterSchema;
exports.GoogleSchema = GoogleSchema;
