'use strict';

var validator = require('validator');
var db = require('../../../components/database');

db.initialize('couchdb');

// Deletes the last.fm process of the requested user.
exports.index = function(req, res) {
  if(req.session.username && !req.session.isAdmin) {
    console.log('User ' + req.session.username + ' attempted to access administrator privileges.');
  }
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var pid = req.body.pid;
  if(!validator.isInt(pid)) {
    return res.json(400, {message: 'Process id is invalid, please use an int.'});
  }
  var processArray = req.app.get('processArray');
  var deleted = false;
  for(var i = 0; i < processArray.length; i++) {
    if(processArray[i].pid === pid) {
      processArray.splice(i, 1);
      req.app.set('processArray', processArray);
      deleted = true;
    }
  }
  if(!deleted) {
    console.log('Attempted to remove pid ' + pid + ' from processArray:');
    console.log(processArray);
    return res.json(500, {message: 'Could not find pid in process array to delete.'});
  }
  db.deleteProcessByPid(pid, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem deleting process, please see logs.'});
    }
    return res.json({message: 'Process deleted.'});
  });
};