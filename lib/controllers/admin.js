var validator = require('validator');
var settings = require('../config/config');
var db = require('../database');
db.initialize('couchdb');

exports.login = function(req, res) {
  var password = req.body.password;
  // TODO Validate admin password and then send session.
  req.session.isAdmin = true;
  return res.json({message: 'Logged in.'});
};

exports.checkCookie = function(req, res) {
  if(!req.session.isAdmin) {
      return res.json(401, {message: 'Please sign in.'});
  }
  return res.json({message: 'Valid.'});
};

exports.logout = function(req, res) {
  delete req.session.isAdmin;
  req.session.destroy(function () {
      return res.json({message: 'Logged out.'});
  });
};

exports.deleteAccount = function(req, res) {
  var username = req.body.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  db.deleteUserByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete account, check logs.'});
    }
    return res.json({message: 'Account deleted.'});
  });
};