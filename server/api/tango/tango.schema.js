var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notEmpty = [function(arr) {
  return arr.length > 0;
}, "Can't be empty."];

var TangoSchema = new Schema({
  title: { type: String, required: true },
  sims: { type: [SimSchema], required: true, validate: notEmpty },
  statements: { type: [StatementSchema], required: true, validate: notEmpty }
});

var SimSchema = new Schema({
  name: { type: String, required: true, maxlength: 5 },
  description: { type: String, required: true, maxlength: 140 }
});

var StatementSchema = new Schema({
  text: { type: String, required: true },
  children: { type: [StatementSchema], required: true },
  focus: { type: Boolean, required: true },
  childrenHidden: { type: Boolean, required: true },
  simId: { type: Number, required: true }
});

exports.TangoSchema = TangoSchema;
exports.SimSchema = SimSchema;
exports.StatementSchema = StatementSchema;
