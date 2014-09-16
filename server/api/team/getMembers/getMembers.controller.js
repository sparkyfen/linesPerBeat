'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var teams = db.getTeamsTable();

// Get list of getMemberss
exports.index = function(req, res) {
  var teamName = req.query.name;
  if(validator.isNull(teamName)) {
    return res.json(400, {message: 'Missing team name.'});
  }
  db.searchByTeamName(teamName, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting members.'});
    }
    if(reply.rows.length === 0) {
      return res.json(400, {message: 'Team does not exist.'});
    }
    var team = reply.rows[0].value;
    var teamUsers = team.users;
    db.searchByMultipleUserIds(teamUsers, function (error, reply) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem getting members.'});
      }
      var userList = [];
      for (var i = 0; i < reply.rows.length; i++) {
        var user = reply.rows[i].value;
        delete user._id;
        delete user._rev;
        delete user.password;
        delete user.apiKey;
        userList.push(user);
      }
      return res.json(userList);
    });
  });
};