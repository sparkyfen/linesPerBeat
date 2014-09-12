'use strict';

var db = require('../../components/database');

db.initialize('couchdb');

// Gets the list of current particpants for the Hackathon.
exports.index = function(req, res) {
  db.searchUserByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting the participant list.'});
    }
    var users = [];
    for(var i = 0; i < reply.rows.length; i++) {
      delete reply.rows[i].value._id;
      delete reply.rows[i].value._rev;
      delete reply.rows[i].value.password;
      delete reply.rows[i].value.apiKey;
      users.push(reply.rows[i].value);
    }
    return res.json(users);
  });
};