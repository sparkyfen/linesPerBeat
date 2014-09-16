'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var db = require('../../../components/database');

db.initialize('couchdb');

var users = db.getUsersTable();
var teams = db.getTeamsTable();

describe('GET /api/team/getMembers', function() {

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
    var userId = uuid.v4();
    db.insert(users, userId, user, function (error) {
      if (error) {
        console.log('Error inserting new user.'.red);
        return done(error);
      }
      var team = {
        name: 'MockTeam',
        logo: 'http://i.imgur.com/BS2iaX2.jpg',
        users: [userId]
       };
      db.insert(teams, uuid.v4(), team, function (error) {
        if (error) {
          console.log('Error inserting new team.'.red);
          return done(error);
        }
        done();
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

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/team/getMembers?name=MockTeam')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});