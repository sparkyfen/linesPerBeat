'use strict';

var should = require('should');
var colors = require('colors');
var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var db = require('../../../components/database');
var settings = require('../../../config/environment');
db.initialize('couchdb');
var users = db.getUsersTable();
var teams = db.getTeamsTable();
var cookie;

describe('POST /api/team/addMember', function() {

  beforeEach(function (done) {
    var user = {
      username: 'mockUser',
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
      admin: false
    };
    var team = {
      name: 'MockTeam',
      url: 'http://i.imgur.com/BS2iaX2.jpg',
      users: []
    };
    var userid = uuid.v4();
    var teamId = uuid.v4();
    db.insert(teams, teamId, team, function (error) {
      if (error) {
        console.log('Error inserting new team.'.red);
        return done(error);
      }
      var adminTeam  = {
        name: 'Admins',
        url: 'http://i.imgur.com/BS2iaX2.jpg',
        users: []
      };
      var adminTeamId = uuid.v4();
      db.insert(teams, adminTeamId, adminTeam, function (error) {
        if (error) {
          console.log('Error inserting new admin team.'.red);
          return done(error);
        }
        db.insert(users, userid, user, function (error) {
          if (error) {
            console.log('Error inserting new user.'.red);
            return done(error);
          }
          request(app).post('/api/user/login')
          .send({username: 'mockUser', password: 'mockPassword'})
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(error, res) {
            if (error) {
              return done(error);
            }
            cookie = res.headers['set-cookie'];
            assert.equal(res.body.message, 'Logged in.');
            done();
          });
        });
      });
    });
  });

  afterEach(function (done) {
    db.searchUserByAll(function (error, reply) {
      if (error) {
        console.log('Error retrieving users.'.red);
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
          console.log('Error deleting users.'.red);
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

  it('should successfully add a member to the team', function(done) {
    var member = {
      name: 'MockTeam'
    };
    request(app)
      .post('/api/team/addMember')
      .expect(200)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(member)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Member added.');
        done();
    });
  });

  it('should fail if missing a team name.', function(done) {
    var member = {
    };
    request(app)
      .post('/api/team/addMember')
      .expect(400)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(member)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Missing team name.');
        done();
    });
  });

  it('should fail if joining the admin team but not an admin.', function(done) {
    var member = {
      name: 'Admins'
    };
    request(app)
      .post('/api/team/addMember')
      .expect(400)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(member)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'You don\'t have permission to join this team.');
        done();
    });
  });
});