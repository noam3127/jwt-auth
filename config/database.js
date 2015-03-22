var mongoose = require('mongoose'),
    mongoURI;

mongoose.connection.on('open', function(ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on('error', function(err) {
  console.log('Could not connect to mongo server!');
  return console.log(err);
});

mongoURI = 'mongodb://localhost/skoperTest';

module.exports = mongoose.connect(mongoURI);