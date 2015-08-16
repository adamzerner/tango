var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: String,
  isAuthenticatedWith: {
    local: String,
    facebook: String,
    twitter: String,
    google: String
  },
  auth: {
    hashedPassword: { type: String, select: false },
    facebookToken: { type: String, select: false },
    twitterToken: { type: String, select: false },
    googleToken: { type: String, select: false }
  },
});
userSchema.plugin(uniqueValidator);

module.exports = userSchema;
