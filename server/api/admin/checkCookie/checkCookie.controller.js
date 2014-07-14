'use strict';

var db = require('../../../components/database');

db.initialize('couchdb');

// Checks the admin cookie to see if it's valid.
exports.index = function(req, res) {
  if(req.session.username && !req.session.isAdmin) {
    console.log('User ' + req.session.username + ' attempted to access administrator privileges.');
  }
  db.searchUserByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem checking admin cookie.'});
    }
    // If they have a username or not, if they don't have admin rights and the DB has a value, they are denied.
    if(!req.session.isAdmin && reply.rows.length > 0) {
      return res.json(401, {message: 'Not an administrator.'});
    }
    return res.json({message: 'Valid.'});
  });
};