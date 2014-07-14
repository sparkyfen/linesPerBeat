'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var assert = require('assert');
var uuid = require('node-uuid');
var db = require('../../components/database');
var bcrypt = require('bcrypt');
var settings = require('../../config/environment');
db.initialize('couchdb');
var users = db.getUsersTable();
var cookie;

describe('GET /api/user/getParticipants', function() {

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
          done();
        });
      });
    });
  });

  it('should respond with the list of particpants', function(done) {
    request(app)
    .get('/api/user/getParticipants')
    .expect(200)
    .expect('Content-Type', /json/)
    .end(function (error, res) {
      if (error) {
        return done(error);
      }
      res.body.should.be.instanceof(Array);
      done();
    });
  });
});