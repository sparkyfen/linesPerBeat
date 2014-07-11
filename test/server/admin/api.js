'use strict';

var should = require('should');
var app = require('../../../server');
var request = require('supertest');
var fs = require('fs');
var uuid = require('node-uuid');
var assert = require('assert');
var nock = require('nock');
var bcrypt = require('bcrypt');
var colors = require('colors');
var settings = require('../../../lib/config/config');
var db = require('../../../lib/database');
db.initialize('couchdb');

var users = db.getUsersTable();

var cookie;
describe('Lines Per Beat API', function () {

  beforeEach(function (done) {
    var admin = {
      username: 'mockAdmin',
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
        request(app).post('/api/user/login')
        .send({username: 'mockAdmin', password: 'mockPassword'})
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
          done();
        });
      });
    });
  });
  describe('POST /api/admin/register', function () {
    it('should successfully register an admin', function (done) {
      var mockUser2 = {
        username: 'mockAdmin2',
        password: 'mockPassword2',
        confirmPassword: 'mockPassword2'
      };
      request(app)
      .post('/api/admin/register')
      .set('cookie', cookie)
      .send(mockUser2)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Registered.');
        done();
      });
    });
  });
  describe('GET /api/admin/checkCookie', function () {
    it('should validate the admin\'s cookie', function (done) {
      request(app)
      .get('/api/admin/checkCookie')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Valid.');
        done();
      });
    });
  });
  describe('POST /api/admin/deleteAccount', function () {
    it('should successfully delete a user account', function (done) {
      request(app)
      .post('/api/admin/deleteAccount')
      .set('cookie', cookie)
      .send({username: 'mockUser'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Account deleted.');
        done();
      });
    });
  });
});