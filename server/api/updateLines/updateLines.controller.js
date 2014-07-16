'use strict';

var validator = require('validator');
var db = require('../../components/database');

db.initialize('couchdb');
var users = db.getUsersTable();

// Updates the user's lines per minute within the database.
exports.index = function(req, res) {
  var apiKey = req.body.apiKey;
  var username = req.body.username;
  var linesAdded = req.body.linesAdded;
  if(!validator.isInt(linesAdded)) {
    return res.json(400, {message: 'Lines added is not a valid number.'});
  }
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating the user\'s lines.'});
    }
    var user = reply.rows[0].value;
    if(user.apiKey !== apiKey) {
      return res.json(400, {message: 'Invalid API Key for this user.'});
    }
    var lastUpdated = user.linesLastUpdated;
    var timeDifference = Date.now() - lastUpdated;
    var timeInMinutes = timeDifference / 1000 / 60;
    var linesPerMinute = linesAdded / timeInMinutes;
    user.linesPerMinute = linesPerMinute;
    db.insert(users, user._id, user, function (error) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem updating the user\'s lines.'});
      }
      return res.json({message: 'Lines updated.'});
    });
  });
};