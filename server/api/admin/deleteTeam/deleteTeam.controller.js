'use strict';

var validator = require('validator');
var db = require('../../../components/database');

db.initialize('couchdb');

// Deletes a team based on team name.
exports.index = function(req, res) {
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var admin = req.session.username;
  var teamName = req.body.name;
  if(validator.isNull(teamName)) {
    return res.json(400, {message: 'Missing team name.'});
  }
  if(teamName === 'Admins') {
    return res.json(400, {message: 'Cannot delete the admin team.'});
  }
  db.deleteTeamByName(teamName, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete team, check logs.'});
    }
    return res.json({message: 'Team deleted.'});
  });
};