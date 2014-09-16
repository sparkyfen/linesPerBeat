'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var users = db.getUsersTable();
var teams = db.getTeamsTable();

// Add member to a team.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var teamName = req.body.name;
  var username = req.session.username;
  if(validator.isNull(teamName)) {
    return res.json(400, {message: 'Missing team name.'});
  }
  if(teamName === 'Admins' && !req.session.isAdmin) {
    return res.json(400, {message: 'You don\'t have permission to join this team.'});
  }
  db.searchByTeamName(teamName, function (error, reply) {
    if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem adding member.'});
      }
      var team = reply.rows[0].value;
      db.searchByUser(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem adding member.'});
        }
        if(reply.rows.length === 0) {
          return res.json(400, {message: 'User does not exist.'});
        }
        var user = reply.rows[0].value;
        var userId = user._id;
        for(var i = 0; i < team.users.length; i++) {
          var teamUserId = team.users[i];
          if(teamUserId === userId) {
            return res.json(400, {message: 'User already on team.'});
          }
        }
        team.users.push(userId)
        db.insert(teams, team._id, team, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem adding member.'});
          }
          return res.json({message: 'Member added.'});
        });
      });
  });
};