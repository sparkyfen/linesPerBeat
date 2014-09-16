'use strict';

var should = require('should');
var colors = require('colors');
var nock = require('nock');
var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var uuid = require('node-uuid');
var bcrypt = require('bcrypt');
var db = require('../../../components/database');
var settings = require('../../../config/environment');
db.initialize('couchdb');
var users = db.getUsersTable();
var cookie;

describe('POST /api/team/addTeam', function() {

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
    db.insert(users, uuid.v4(), user, function (error) {
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
    // Mock the Imgur call for file uploading.
    nock('https://api.imgur.com', {reqheaders: {
    'Authorization': 'Client-ID mockClientId'
    }}).post('/3/upload')
    .reply(200, {"data":{"id":"rrwkbGo","title":null,"description":null,"datetime":1405057112,"type":"image\/jpeg","animated":false,"width":640,"height":972,"size":53957,"views":0,"bandwidth":0,"favorite":false,"nsfw":null,"section":null,"deletehash":"u6w57wEeV7YfDUh","link":"http:\/\/i.imgur.com\/rrwkbGo.jpg"},"success":true,"status":200});
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

  it('should successfully add a team', function (done) {
    var team = {
      name: 'MockName',
      url: 'http://i.imgur.com/BS2iaX2.jpg'
    };
    request(app)
      .post('/api/team/addTeam')
      .expect(200)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(team)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Team added.');
        done();
      });
  });
  it('should fail if the team name is missing', function (done) {
    var team = {
      url: 'http://i.imgur.com/BS2iaX2.jpg'
    };
    request(app)
      .post('/api/team/addTeam')
      .expect(400)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(team)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Missing team name.');
        done();
      });
  });
  it('should fail if the team logo is missing', function (done) {
    var team = {
      name: 'MockName'
    };
    request(app)
      .post('/api/team/addTeam')
      .expect(400)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(team)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Missing team logo.');
        done();
      });
  });
  it('should fail if the team logo url is invalid', function (done) {
    var team = {
      name: 'MockName',
      url: 'NotAURL'
    };
    request(app)
      .post('/api/team/addTeam')
      .expect(400)
      .expect('Content-Type', /json/)
      .set('cookie', cookie)
      .send(team)
      .end(function(err, res) {
        if (err) {
          return done(err);
        }
        assert.equal(res.body.message, 'Invalid URL.');
        done();
      });
  });
});