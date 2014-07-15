/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

var uuid = require('node-uuid');
var running = require('is-running');
var colors = require('colors');
var db = require('./components/database');
var LastFmNode = require('lastfm').LastFmNode;
var spawn = require('child_process').spawn;
var lastfm = new LastFmNode({
  api_key: config.lastfm.apiKey,
  secret: config.lastfm.secret,
  useragent: config.lastfm.useragent
});

db.initialize('couchdb');

var users = db.getUsersTable();
var childProcesses = db.getChildTable();

var processArray = [];

/**
 * Search for each user in the child proccess DB and start up a listener for them. Update the DB with their PID afterwards.
 */
function kickOffLastFMListener() {
  db.searchProcessByAll(function (error, reply) {
    if(error) {
      return console.log(error);
    }
    var updated = false;
    console.log('Kicking off Last.FM Listeners'.green);
    for(var i = 0; i < reply.rows.length; i++) {
      (function () {
        var processEntry = reply.rows[i].value;
        running(processEntry.pid, function (error, live) {
          console.log('Checking to see if pid ' + processEntry.pid + ' is still running.');
          if(error) {
            return console.log(error);
          }
          if(!live) {
            var listener = spawn('node', [__dirname + '/api/linkAccounts/lastfmListener.js', '-l', processEntry.lastfmUser, '-u', processEntry.username]);
            processArray.push(listener);
            console.log(('Running new Last.FM Listener Instance with PID ' + listener.pid).green);
            listener.stdout.on('data', function (data) {
              console.log('stdout: ' + data);
            });
            listener.stderr.on('data', function (data) {
              console.log('Make sure you are not restarting the web server a lot, it makes tons of calls to Last.FM for each process startup.');
              console.log('stderr: ' + data);
            });
            // TODO Need to finish getting the signal catcher for the listeners working.
            listener.on('exit', function (code, signal) {
              console.log(('Closing Process with PID ' + listener.pid).red);
              db.deleteProcessByPid(listener.pid, function (error, reply) {
                if(error) {
                  return console.log(error);
                }
              });
            });
            var user = {
              _rev: processEntry._rev,
              lastfmUser: processEntry.lastfmUser,
              username: processEntry.username,
              pid: listener.pid
            };
            if(processEntry.username === user.username) {
              updated = true;
              db.insert(childProcesses, processEntry._id, user, function (error) {
                if(error) {
                  return console.log(error);
                }
              });
            }
            if(!updated) {
              db.insert(childProcesses, uuid.v4(), user, function (error) {
                if(error) {
                  return console.log(error);
                }
              });
            }
          }
        });
      })();
    }
  });
}

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  kickOffLastFMListener();
});

// If the express server dies, kill other child processes in case they are still running and then exit.
process.on('SIGTERM', function () {
  for(var i = 0; i < processArray.length; i++) {
    process.kill(processArray[i].pid, 'SIGINT');
  }
  process.exit(0);
});

// Expose app
exports = module.exports = app;