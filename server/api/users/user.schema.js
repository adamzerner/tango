var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var ObjectId = Schema.Types.ObjectId;
var schemaFile = require('../tangos/tango.schema.js');
var TangoSchema = schemaFile.TangoSchema;
var SimSchema = schemaFile.SimSchema;

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

var UserSchema = new Schema({
  local: { type: ObjectId, ref: 'Local' },
  facebook: { type: ObjectId, ref: 'Facebook' },
  twitter: { type: ObjectId, ref: 'Twitter' },
  google: { type: ObjectId, ref: 'Google' },
  tangos: { type: [TangoSchema] },
  sims: { type: [SimSchema] }
});

exports.LocalSchema = LocalSchema;
exports.FacebookSchema = FacebookSchema;
exports.TwitterSchema = TwitterSchema;
exports.GoogleSchema = GoogleSchema;
exports.UserSchema = UserSchema;
