'use strict';

var validator = require('validator');
var uuid = require('node-uuid');
var db = require('../../components/database');
var settings = require('../../config/environment');
var LastFmNode = require('lastfm').LastFmNode;
var spawn = require('child_process').spawn;
var lastfm = new LastFmNode({
  api_key: settings.lastfm.apiKey,
  secret: settings.lastfm.secret,
  useragent: settings.lastfm.useragent
});

db.initialize('couchdb');

var users = db.getUsersTable();
var childProcesses = db.getChildTable();

/**
 * Creates a singleton that listens to the user's new tracks.
 *
 * @param lastfmUser The last.fm username to listen to.
 */
function kickOffFMListener(lastfmUser, username) {
  db.searchProcessByAll(function (error, reply) {
    if(error) {
      return console.log(error);
    }
    var updated = false;
    var listener = spawn('node', [__dirname + '/lastfmListener.js', '-l', lastfmUser, '-u', username]);
    console.log('Running new Last.FM Listener Instance with PID ' + listener.pid);
    listener.stdout.on('data', function (data) {
      console.log('stdout: ' + data);
    });
    listener.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
    listener.on('exit', function (code, signal) {
      console.log('Closing Process with PID ' + listener.pid);
      db.deleteProcessByPid(listener.pid, function (error, reply) {
        if(error) {
          return console.log(error);
        }
      });
    });

    var user = {
      lastfmUser: lastfmUser,
      username: username,
      pid: listener.pid
    };
    db.searchProcessByAll(function (error, reply) {
      if(error) {
        return console.log(error);
      }
      var updated = false;
      for(var i = 0; i < reply.rows.length; i++) {
        var process = reply.rows[i].value;
        if(process.username === user.username) {
          updated = true;
          db.insert(childProcesses, process._id, user, function (error) {
            if(error) {
              return console.log(error);
            }
          });
        }
      }
      if(!updated) {
        db.insert(childProcesses, uuid.v4(), user, function (error) {
          if(error) {
            return console.log(error);
          }
        });
      }
    });
  });
}

// Links the user with their Last.FM account.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var lastfmUser = req.body.lastfmUser;
  if(validator.isNull(lastfmUser)) {
    return res.json(400, {message: 'Missing Last.FM username.'});
  }
  var username = req.session.username;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating password.'});
    }
    var user = reply.rows[0].value;
    lastfm.request('user.getInfo', {
      user: lastfmUser,
      handlers: {
        success: function(lastfmData) {
          user.lastfm.username = lastfmData.user.name;
          user.lastfm.id = lastfmData.user.id;
          db.insert(users, user.id, user, function (error) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Could not link accounts.'});
            }
            // For testing purposes.
            if(settings.env === 'test') {
              return res.json({message: 'Accounts linked.'});
            }
            kickOffFMListener(user.lastfm.username, user.username);
            return res.json({message: 'Accounts linked.'});
          });
        },
        error: function(response) {
          if(response.error === 6) {
            return res.json(400, {message: response.message});
          } else {
            console.log(response);
            return res.json(400, {message: 'Could not link accounts.'});
          }
        }
      }
    });
  });
};