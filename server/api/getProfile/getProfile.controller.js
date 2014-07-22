'use strict';

var validator = require('validator');
var db = require('../../components/database');

db.initialize('couchdb');

// Get the user's profile.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Invalid username.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting profile.'});
    }
    var user = reply.rows[0].value;
    delete user._id;
    delete user._rev;
    delete user.password;
    delete user.apiKey;
    return res.json(user);
  });
};