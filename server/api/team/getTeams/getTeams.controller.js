'use strict';

var validator = require('validator');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');

var teams = db.getTeamsTable();

// Gets the list of teams.
exports.index = function(req, res) {
  db.searchTeamByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting the team list.'});
    }
    var teams = [];
    for(var i = 0; i < reply.rows.length; i++) {
      delete reply.rows[i].value._id;
      delete reply.rows[i].value._rev;
      delete reply.rows[i].value.users;
      teams.push(reply.rows[i].value);
    }
    return res.json(teams);
  });
};