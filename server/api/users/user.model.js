console.log('top of user.model.js');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');
var autopopulate = require('mongoose-autopopulate');
var ObjectId = Schema.Types.ObjectId;

var userSchema = new Schema({
  local: { type: ObjectId, ref: 'Local' },
  facebook: { type: ObjectId, ref: 'Facebook', autopopulate: true },
  twitter: { type: ObjectId, ref: 'Twitter', autopopulate: true },
  google: { type: ObjectId, ref: 'Google', autopopulate: true }
});
userSchema.plugin(autopopulate);

var localSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'auth']
  },
  hashedPassword: {
    type: String,
    required: true,
    select: false
  }
});
localSchema.plugin(uniqueValidator);

var facebookSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

var twitterSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

var googleSchema = new Schema({
  id: { type: String, required: true },
  token: { type: String, required: true }
});

var User = mongoose.model('User', userSchema);
var Local = mongoose.model('Local', localSchema);
var Facebook = mongoose.model('Facebook', facebookSchema);
var Twitter = mongoose.model('Twitter', twitterSchema);
var Google = mongoose.model('Google', googleSchema);

console.log('bottom of user.model.js');
// console.log('Created User model: ', User);

exports.UserSchema = userSchema;
exports.LocalSchema = localSchema;
