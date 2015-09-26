var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// var StatementSchema = new Schema({
//   text: { type: String, required: true },
//   children: [],
//   focus: { type: Boolean, required: true },
//   childrenHidden: { type: Boolean, required: true },
//   simNumber: { type: Number, required: true }
// });

var StatementSchema = new Schema();
StatementSchema.add({
  text: { type: String, required: true },
  children: [StatementSchema],
  focus: { type: Boolean, required: true },
  childrenHidden: { type: Boolean, required: true },
  simNumber: { type: Number, required: true }
});

var SimSchema = new Schema({
  name: { type: String, required: true, maxlength: 5 },
  description: { type: String, required: true, maxlength: 140 }
});

var TangoSchema = new Schema({
  title: { type: String, required: true },
  sims: { type: [SimSchema], required: true },
  statements: { type: [StatementSchema], required: true }
});

exports.TangoSchema = TangoSchema;
exports.SimSchema = SimSchema;
exports.StatementSchema = StatementSchema;
