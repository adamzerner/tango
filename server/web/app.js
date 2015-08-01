var path = require('path');
var express = require('express');
var app = express();

app.use(express.static('client'));

app.get('/*', function(req, res) {
  var url = path.resolve(__dirname + '/../../client/index.html');
  res.sendFile(url, null, function(err) {
    if (err) res.status(500).send(err);
    else res.status(200).end();
  });
});

app.listen(3000, function() {
  console.log('Web server listening on port 3000...');
});
