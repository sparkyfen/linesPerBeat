'use strict';

var validator = require('validator');
var db = require('../../../components/database');

db.initialize('couchdb');

// Delete user/admin accounts based on username.
exports.index = function(req, res) {
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.body.username;
  var requestor = req.session.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(username === requestor) {
    return res.json(400, {message: 'Can\'t delete your own account.'});
  }
  db.deleteUserByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete account, check logs.'});
    }
    return res.json({message: 'Account deleted.'});
  });
};