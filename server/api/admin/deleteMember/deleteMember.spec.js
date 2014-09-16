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
var teams = db.getTeamsTable();
var cookie;

describe('POST /api/admin/deleteMember', function() {

  beforeEach(function (done) {
     var admin = {
      username: 'mockAdmin',
      password: bcrypt.hashSync('mockPassword', 10),
      firstName: 'Foo',
      lastName: 'Bar',
      avatar: 'assets/images/default.png',
      lastfm: {
        username: '',
        currentSong: {
          artist: '',
          song: '',
          url: '',
          lastUpdated: Date.now()
        }
      },
      linesPerMinute: 0.0,
      linesLastUpdated: Date.now(),
      admin: true
    };
    var user = {
      username: 'mockUser',
      password: bcrypt.hashSync('mockPassword', 10),
      firstName: 'Foo',
      lastName: 'Bar',
      avatar: 'images/default.png',
      lastfm: {
        username: '',
        currentSong: {
          artist: '',
          song: '',
          url: '',
          lastUpdated: Date.now()
        }
      },
      linesPerMinute: 0.0,
      linesLastUpdated: Date.now(),
      admin: false
    };
    var userId = uuid.v4();
    var team = {
      name: 'MockTeam',
      logo: 'http://i.imgur.com/BS2iaX2.jpg',
      users: [userId]
     };
    db.insert(users, uuid.v4(), admin, function (error) {
      if (error) {
        console.log('Error inserting new admin.'.red);
        return done(error);
      }
      db.insert(users, userId, user, function (error) {
        if (error) {
          console.log('Error inserting new user.'.red);
          return done(error);
        }
        db.insert(teams, uuid.v4(), team, function (error) {
          if (error) {
            console.log('Error inserting new team.'.red);
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
      var docs = [];
      for (var i = 0; i < reply.rows.length; i++) {
        var user = reply.rows[i].value;
        user._deleted = true;
        docs.push(user);
      }
      db.deleteAllUsers(docs, function(error, reply) {
        if (error) {
          console.log('Error deleting admins.'.red);
          return done(error);
        }
        db.compactUserDB(function (error, reply) {
          if (error) {
            console.log('Error compacting user database.'.red);
            return done(error);
          }
          db.searchTeamByAll(function (error, reply) {
            if (error) {
              console.log('Error retrieving teams.'.red);
              return done(error);
            }
            var docs = [];
            for (var i = 0; i < reply.rows.length; i++) {
              var team = reply.rows[i].value;
              team._deleted = true;
              docs.push(team);
            }
            db.deleteAllTeams(docs, function(error, reply) {
              if (error) {
                console.log('Error deleting teams.'.red);
                return done(error);
              }
              db.compactTeamDB(function (error, reply) {
                if (error) {
                  console.log('Error compacting team database.'.red);
                  return done(error);
                }
                done();
              });
            });
          });
        });
      });
    });
  });

  it('should successfully delete a member from the team.', function(done) {
    var memberReq = {
      teamname: 'MockTeam',
      username: 'mockUser'
    };
    request(app)
      .post('/api/admin/deleteMember')
      .expect(200)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(memberReq)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Member deleted.')
        done();
      });
  });
});