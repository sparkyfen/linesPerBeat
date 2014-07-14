'use strict';

var _ = require('lodash');
var validator = require('validator');
var bcrypt = require('bcrypt');
var db = require('../../components/database');
var settings = require('../../config/environment');

db.initialize('couchdb');

// Log the user into the site.
exports.index = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(password)) {
    return res.json(400, {message: 'Missing password.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem logging user ' + username + ' in.'});
    }
    if(reply.rows.length === 0) {
      return res.json(400, {message: 'Invalid username.'});
    }
    var user = reply.rows[0].value;
    bcrypt.compare(password, user.password, function (error, compareResult) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem logging user ' + username + ' in.'});
      }
      if(!compareResult) {
        return res.json(400, {message: 'Invalid password.'});
      }
      req.session.username = username;
      if(user.admin) {
        req.session.isAdmin = true;
      }
      return res.json({message: 'Logged in.'});
    });
  });
};