'use strict';

var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var uuid = require('node-uuid');
var db = require('../../../components/database');
var bcrypt = require('bcrypt');
var settings = require('../../../config/environment');
db.initialize('couchdb');
var users = db.getUsersTable();
var processes = db.getChildTable();
var cookie;

describe('POST /api/admin/deleteProcess', function() {

  beforeEach(function (done) {
    var admin = {
      username: 'mockAdmin',
      password: bcrypt.hashSync('mockPassword', 10),
      firstName: 'Foo',
      lastName: 'Bar',
      avatar: 'assets/images/default.png',
      lastfm: {
        username: 'LastFM',
        currentSong: {
          artist: '',
          song: '',
          url: '',
          lastUpdated: Date.now()
        }
      },
      linesPerMinute: 0.0,
      linesLastUpdated: Date.now(),
      pid: 123456,
      admin: true
     };
     var user = {
      username: 'mockUser',
      password: bcrypt.hashSync('mockPassword', 10),
      firstName: 'Foo',
      lastName: 'Bar',
      avatar: 'images/default.png',
      lastfm: {
        username: 'LastFM',
        currentSong: {
          artist: '',
          song: '',
          url: '',
          lastUpdated: Date.now()
        }
      },
      linesPerMinute: 0.0,
      linesLastUpdated: Date.now(),
      pid: 12345,
      admin: false
    };
    var processEntry = {
      lastFmUser: 'LastFM',
      username: 'mockUser',
      pid: 12345
    };
    db.insert(users, uuid.v4(), admin, function (error) {
      if (error) {
        console.log('Error inserting new admin.'.red);
        return done(error);
      }
      db.insert(users, uuid.v4(), user, function (error) {
        if (error) {
          console.log('Error inserting new user.'.red);
          return done(error);
        }
        db.insert(processes, uuid.v4(), processEntry, function (error) {
          if(error) {
            console.log('Error inserting new process.'.red);
            return done(error);
          }
          request(app).post('/api/user/login')
          .send({username: 'mockAdmin', password: 'mockPassword'})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(error, res) {
            if (error) {
              return done(error);
            }
            cookie = res.headers['set-cookie'];
            done();
          });
        });
      });
    });
  });

  afterEach(function (done) {
    db.searchUserByAll(function (error, reply) {
      if (error) {
        console.log('Error retrieving admins.'.red);
        return done(error);
      }
      var userDocs = [];
      for (var i = 0; i < reply.rows.length; i++) {
        var user = reply.rows[i].value;
        user._deleted = true;
        userDocs.push(user);
      }
      db.searchProcessByAll(function (error, reply) {
        if (error) {
          console.log('Error retrieving processes.'.red);
          return done(error);
        }
        var processDocs = [];
        for (var i = 0; i < reply.rows.length; i++) {
          var process = reply.rows[i].value;
          process._deleted = true;
          processDocs.push(process);
        }
        db.deleteAllProcesses(processDocs, function (error, reply) {
          if (error) {
            console.log('Error deleting processes.'.red);
            return done(error);
          }
          db.deleteAllUsers(userDocs, function (error, reply) {
            if (error) {
              console.log('Error deleting admins.'.red);
              return done(error);
            }
            db.compactUserDB(function (error, reply) {
              if (error) {
                console.log('Error compacting user database.'.red);
                return done(error);
              }
              done();
            });
          });
        });
      });
    });
  });

  it('should successfully delete the requested process', function (done) {
    app.set('processArray', [{pid: 12345}, {pid: 123456}]);
    request(app)
    .post('/api/admin/deleteProcess')
    .set('cookie', cookie)
    .send({pid: 12345})
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (error, res) {
      if (error) {
        return done(error);
      }
      assert.equal(res.body.message, 'Process deleted.');
      done();
    });
  });
});