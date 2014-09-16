'use strict';

var validator = require('validator');
var db = require('../../../components/database');

db.initialize('couchdb');

// Delete a member from a team.
exports.index = function(req, res) {
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var teamName = req.body.teamname;
  var username = req.body.username;
  var requestor = req.session.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(teamName)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(username === requestor) {
    return res.json(400, {message: 'Can\'t remove yourself from a team.'});
  }
  db.deleteUserFromTeam(teamName, username, function (error) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete member, check logs.'});
    }
    return res.json({message: 'Member deleted.'});
  });
};