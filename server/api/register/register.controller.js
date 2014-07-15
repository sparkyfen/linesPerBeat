'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var db = require('../../components/database');

db.initialize('couchdb');

var users = db.getUsersTable();

// Register a new user.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(password) || validator.isNull(confirmPassword)) {
    return res.json(400, {message: 'Missing password(s).'});
  }
  if(password !== confirmPassword) {
    return res.json(400, {message: 'Passwords don\'t match.'});
  }
  bcrypt.hash(password, 10, function (error, hash) {
    if(error) {
     console.log(error);
     return res.json(500, {message: 'Problem registering user ' + username + '.'});
   }
   var userId = uuid.v4();
   var user = {
    username: username,
    password: hash,
    firstName: firstName || '',
    lastName: lastName || '',
    avatar: 'assets/images/default.png',
    lastfm: {
      username: '',
      currentSong: {
        artist: '',
        song: '',
        url: '',
        lastUpdated: Date.now()
      }
    },
    linesPerMinute: 0.0,
    linesLastUpdated: Date.now(),
    admin: false
   };
   // Check to see if the user id exists (should not because its uuid generated).
   db.peekForUser(userId, function (error, reply) {
    if(error && error.status_code !== 404) {
      console.log(error);
      return res.json(500, {message: 'Problem registering user ' + username + '.'});
    }
    if(reply) {
      return res.json(400, {message: 'User id already exists.'});
    }
    db.searchUserByAll(function (error, reply) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem registering user ' + username + '.'});
      }
      if(reply.rows.length === 0) {
        return res.json(400, {message: 'You need to make an administrative account first.'});
      }
      // Check to see if the username exists.
      db.searchByUser(username, function (error, reply) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem registering user ' + username + '.'});
        }
        if(reply.rows.length > 0) {
          return res.json(400, {message: 'User already exists.'});
        }
        // Create user
        db.insert(users, userId, user, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem registering user ' + username + ', please try again.'});
          }
          req.session.username = username;
          // If an admin was previously signed in, we will delete their session and update the session with the new user.
          if(req.session.isAdmin) {
            delete req.session.isAdmin;
          }
          return res.json({message: 'Registered.'});
        });
      });
    });
   });
 });
};