var express = require('express'),
  User = require('../models/user'),
  jwt = require('jwt-simple'),
  moment = require('moment'),
  router = express.Router();

var authenticateUser = function(req, res, next) {
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) return next(err);
    if (!user) {
      return res.status(404).send('No user found with that email address');
    }
    user.comparePassword(req.body.password, function(err, isMatch) {
      if (err) return next(err);
      if (!isMatch) {
        res.status(403).send('Wrong password');
      } else {
        req.user = user;
        next();
      }
    });
  });
};

router.post('/signup', function(req, res, next) {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(400).send('Must provide email and password');
  }
  var userData = {
    email: req.body.email,
    password: req.body.password
  };

  User.findOne({email: req.body.email}, function(err, doc) {
    if (err) return next(err);
    if (doc) {
      return res.status(409).send('Email is already taken');
    }
    var user = new User(userData);

    user.save(user, function(err) {
      return next(err);
    });

    var expires = moment().add(7, 'days').valueOf();
    var token = jwt.encode({
      iss: user._id,
      exp: expires
    }, req.app.get('JWT_SECRET'));

    res.status(201).json({
      token: token,
      expires: expires,
      user: user._id
    });
  });

});

router.post('/login', authenticateUser, function(req, res, next) {
  var expires = moment().add(7, 'days').valueOf();
  var token = jwt.encode({
    iss: req.user._id,
    exp: expires
  }, req.app.get('JWT_SECRET'));
  res.json({
    token: token,
    expires: expires,
    user: req.user._id
  });

});

module.exports = router;
