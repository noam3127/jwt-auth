var User = require('../models/user');
var jwt = require('jwt-simple');

module.exports = function(req, res, next) {
  req.jwtAuth = this;
	var token = (req.body && req.body.access_token) ||
              (req.query && req.query.access_token) ||
              req.headers['x-access-token'];

  if (token) {
    try {
      var decoded = jwt.decode(token, req.app.get('JWT_SECRET'));
      if (decoded.exp <= Date.now()) {
        res.status(400).send('Access token has expired');
      }
      User.findById(decoded.iss, function(err, user) {
        if (err) return next(err);
        req.user = user;
        next();
      });

    } catch(err) {
      return next(err);
    }
  } else {
    res.status(401).send('Missing access token');
  }
};