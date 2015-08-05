var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  role: String
});
userSchema.plugin(uniqueValidator);

module.exports = userSchema;
