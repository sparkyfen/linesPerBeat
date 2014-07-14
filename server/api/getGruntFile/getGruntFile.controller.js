'use strict';

var fs = require('fs');
var db = require('../../components/database');

db.initialize('couchdb');

// Gets the user's GruntFile.js to watch their code changes.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting grunt file.'});
    }
    var user = reply.rows[0].value;
    var gruntFile = user.gruntFile;
    var fileName = 'gruntFile' + user.username + '.js';
    var filePath = '/tmp/' + fileName;
    fs.writeFileSync(filePath, gruntFile, {encoding: 'utf8'});
    res.download(filePath, fileName, function (error) {
      if(error) {
        if(res.headersSent) {
          return res.send(400);
        } else {
          return res.json(400, {message: 'Missing grunt file.'});
        }
      }
      fs.unlinkSync(filePath);
    });
  });
};