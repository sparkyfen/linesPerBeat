'use strict';

var db = require('../../../components/database');

db.initialize('couchdb');

// Gets the list of proccess for each user.
exports.index = function(req, res) {
  if(req.session.username && !req.session.isAdmin) {
    console.log('User ' + req.session.username + ' attempted to access administrator privileges.');
  }
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  db.searchProcessByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not get proccess list.'});
    }
    var proccesses = [];
    for(var i = 0; i < reply.rows.length; i++) {
      delete reply.rows[i].value._id;
      delete reply.rows[i].value._rev;
      proccesses.push(reply.rows[i].value);
    }
    return res.json(proccesses);
  });
};