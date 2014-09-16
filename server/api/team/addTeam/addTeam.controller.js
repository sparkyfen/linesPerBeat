'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var imgur = require('imgur-node-api');
var db = require('../../../components/database');
var settings = require('../../../config/environment');

db.initialize('couchdb');
imgur.setClientID(settings.imgur.clientId);

var users = db.getUsersTable();
var teams = db.getTeamsTable();

/**
 * Uploads an image to Imgur using their v3 API service.
 *
 * @param  {String} imageURL
 *   The file path or URL of the image.
 * @param  {Function} callback
 *   The callback function to send the data back with.
 *
 * @return
 *   The callback function to send the data back with.
 */
function _uploadImage(imageURL, callback) {
  // Let Imgur take care of whether or not the file is an image or not.
  imgur.upload(imageURL, function (error, reply) {
    if(error) {
      return callback(error);
    }
    if(reply.success) {
      return callback(null, reply.data.link);
    } else if (!reply.success && typeof(reply.data.error) === 'object') {
      return callback(reply.data.error.type + ' ' + reply.data.error.message);
    } else {
      return callback(reply.data.error);
    }
  });
}

exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var teamName = req.body.name;
  var teamLogo = req.body.url;
  if(validator.isNull(teamName)) {
    return res.json(400, {message: 'Missing team name.'});
  }
  if(validator.isNull(teamLogo)) {
    return res.json(400, {message: 'Missing team logo.'});
  }
  if(!validator.isURL(teamLogo)) {
    return res.json(400, {message: 'Invalid URL.'});
  }
  var teamId = uuid.v4();
  var team = {
    name: teamName,
    logo: '',
    users: []
  };
  // Check to see if the team name exists.
  db.searchByTeamName(teamName, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem registering team ' + teamName + '.'});
    }
    if(reply.rows.length > 0) {
      return res.json(400, {message: 'Team already exists.'});
    }
    _uploadImage(teamLogo, function (error, link) {
      if(error) {
        return res.json(500, {message: error});
      }
      team.logo = link;
      // Create team
      db.insert(teams, teamId, team, function (error) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem registering team ' + teamName + ', please try again.'});
        }
        return res.json({message: 'Team added.'});
      });
    });
  });
};