'use strict';

var validator = require('validator');
var bcrypt = require('bcrypt');
var db = require('../../components/database');
var settings = require('../../config/environment');

db.initialize('couchdb');

var users = db.getUsersTable();

// Changes the user's password.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var confirmNewPass = req.body.confirmNewPassword;
  if(validator.isNull(oldPassword)) {
    return res.json(400, {message: 'Missing old password.'});
  }
  if(validator.isNull(newPassword) || validator.isNull(confirmNewPass)) {
    return res.json(400, {message: 'Missing new password(s).'});
  }
  if(newPassword !== confirmNewPass) {
    return res.json(400, {message: 'New passwords don\'t match.'});
  }
  if(oldPassword === newPassword) {
    return res.json(400, {message: 'Cannot use old password as new password.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating password.'});
    }
    var user = reply.rows[0].value;
    bcrypt.compare(oldPassword, user.password, function (error, result) {
      if(error) {
        console.log(error);
        return res.json(400, {message: 'Problem updating password.'});
      }
      if(!result) {
        return res.json(400, {message: 'Invalid old password.'});
      }
      bcrypt.hash(newPassword, 10, function (error, newHash) {
        if(error) {
          console.log(error);
          return res.json(400, {message: 'Problem updating password.'});
        }
        user.password = newHash;
        db.insert(users, user._id, user, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem updating password.'});
          }
          delete req.session.username;
          req.session.destroy(function (error) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Problem updating password.'});
            }
            return res.json({message: 'Password updated, please sign in.'});
          });
        });
      });
    });
  });
};