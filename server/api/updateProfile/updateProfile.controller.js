'use strict';

var validator = require('validator');
var db = require('../../components/database');
var settings = require('../../config/environment');
var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
  api_key: settings.lastfm.apiKey,
  secret: settings.lastfm.secret,
  useragent: settings.lastfm.useragent
});

db.initialize('couchdb');
var users = db.getUsersTable();

// Updates the user's profile.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var lastfmUser = req.body.lastfmUser;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(lastfmUser)) {
    return res.json(400, {message: 'Missing Last.FM user.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating profile.'});
    }
    var user = reply.rows[0].value;
    var userId = user.id;
    if(user.lastName !== lastName) {
      user.lastName = lastName;
    }
    if(user.firstName !== firstName) {
      user.firstName = firstName;
    }
    lastfm.request('user.getInfo', {
      user: lastfmUser,
      handlers: {
        success: function(lastfmData) {
          user.lastfm.username = lastfmData.user.name;
          user.lastfm.id = lastfmData.user.id;
          db.insert(users, userId, user, function (error) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Problem updating profile.'});
            }
            // TODO Kick off Last.FM Listener on updated profile by killing old process and starting new one.
            return res.json({message: 'Profile updated.'});
          });
        },
        error: function(response) {
          if(response.error === 6) {
            return res.json(400, {message: response.message});
          } else {
            console.log(response);
            return res.json(500, {message: 'Problem updating profile.'});
          }
        }
      }
    });
  });
};