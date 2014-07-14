'use strict';

var validator = require('validator');
var db = require('../../components/database');

db.initialize('couchdb');
var users = db.getUsersTable();

// Updates the user's lines per minute within the database.
exports.index = function(req, res) {
  var username = req.body.username;
  var currentTime = req.body.currentTime;
  var linesAdded = req.body.linesAdded;
  if(!validator.isInt(currentTime)) {
    return res.json(400, {message: 'CurrentTime is not a valid date.'});
  }
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
    var lastUpdated = user.linesLastUpdated;
    var timeDifference = currentTime - lastUpdated;
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