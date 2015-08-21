var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/test');

var subDocumentSchema = new Schema({
  subFoo: { type: String, select: false }
});

var userSchema = new Schema({
  foo: String,
  stuff: { type: [subDocumentSchema], select: false }
});

var User = mongoose.model('User', userSchema);
var SubDocument = mongoose.model('SubDocument', subDocumentSchema);

// SubDocument.create({
//   subFoo: 'baz'
// }, function(err, subDoc) {
// });
User.create({
  foo: 'bar',
  stuff: [{
    subFoo: 'baz'
  }]
}, function(err, doc) {
  var id = doc._id;
  User.findById(id, function(err, doc) {
    console.log('doc: ', doc);
  });
});
