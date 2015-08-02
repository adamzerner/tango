var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  role: String
});
userSchema.plugin(uniqueValidator);

module.exports = userSchema;
