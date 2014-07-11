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
    // Mock the Last.FM user get.info request.
    nock('http://ws.audioscrobbler.com')
    .get('/2.0?user=lastfm&method=user.getInfo&api_key='+settings.lastfm.apiKey+'&format=json')
    .reply(200, {"user":{"name":"lastfm","realname":"","image":[{"#text":"","size":"small"},{"#text":"","size":"medium"},{"#text":"","size":"large"},{"#text":"","size":"extralarge"}],"url":"http:\/\/www.last.fm\/user\/lastfm","id":"375","country":"","age":"","gender":"","subscriber":"0","playcount":"8378","playlists":"1","bootstrap":"0","registered":{"#text":"2002-10-29 00:00","unixtime":"1035849600"},"type":"user"}});
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
          done();
        });
      });
    });
  });

  describe('GET /api/user/getParticipants', function() {
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
  describe('GET /api/user/logout', function () {
    it('should successfully log the user out', function (done) {
      request(app)
      .get('/api/user/logout')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Logged out.');
        done();
      });
    });
  });
  describe('POST /api/user/register', function () {
    it('should successfully register a user', function (done) {
      var mockUser2 = {
        username: 'mockUser2',
        password: 'mockPassword2',
        confirmPassword: 'mockPassword2'
      };
      request(app)
      .post('/api/user/register')
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
    it('should fail to register a duplicate user', function (done) {
      var mockUser = {
        username: 'mockUser',
        password: 'mockPassword',
        confirmPassword: 'mockPassword'
      };
      request(app)
      .post('/api/user/register')
      .send(mockUser)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'User already exists.');
        done();
      });
    });
    it('should fail to register a user with mismatching passwords', function (done) {
      var mockUser = {
        username: 'mockUser',
        password: 'mockPassword',
        confirmPassword: 'mockPassword2'
      };
      request(app)
      .post('/api/user/register')
      .send(mockUser)
      .expect(400)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Passwords don\'t match.');
        done();
      });
    });
  });
  describe('GET /api/user/getProfile', function () {
    it('should successfully get the user\'s profile', function (done) {
      request(app)
      .get('/api/user/getProfile')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.username, 'mockUser');
        done();
      });
    });
    it('should fail if user is not signed in', function (done) {
      request(app)
      .get('/api/user/getProfile')
      .expect(401)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Please sign in.');
        done();
      });
    });
  });
  describe('POST /api/user/updateProfile', function () {
    it('should successfully update the user\'s profile', function (done) {
      request(app)
      .post('/api/user/updateProfile')
      .set('cookie', cookie)
      .send({firstName: 'Foo', lastName: 'Bar', lastfmUser: 'lastfm'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Profile updated.');
        done();
      });
    });
  });
  describe('POST /api/user/changePassword', function () {
    it('should successfully change the user\'s password', function (done) {
      request(app)
      .post('/api/user/changePassword')
      .set('cookie', cookie)
      .send({oldPassword: 'mockPassword', newPassword: 'mockPassword2', confirmNewPassword: 'mockPassword2'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Password updated.');
        done();
      });
    });
  });
  describe('POST /api/user/linkAccounts', function () {
    it('should successfully link the user\'s Last.FM account', function (done) {
      request(app)
      .post('/api/user/linkAccounts')
      .set('cookie', cookie)
      .send({lastfmUser: 'lastfm'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Accounts linked.');
        done();
      });
    });
  });
  describe('GET /api/user/gruntfile.js', function () {
    it('should successfully download the grunt file', function (done) {
      request(app)
      .get('/api/user/gruntfile.js')
      .set('cookie', cookie)
      .expect(200)
      .expect('Content-Type', /javascript/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.headers['content-disposition'], 'attachment; filename="gruntFilemockUser.js"');
        done();
      });
    });
  });
  describe('POST /api/user/updateLines', function () {
    it('should successfully update the user\'s lines per minute', function (done) {
      request(app)
      .post('/api/user/updateLines')
      .send({currentTime: Date.now(), linesAdded: 20, username: 'mockUser'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        assert.equal(res.body.message, 'Lines updated.');
        done();
      });
    });
  });
  describe('GET /api/user/checkCookie', function () {
    it('should validate the user\'s cookie', function (done) {
      request(app)
      .get('/api/user/checkCookie')
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
  describe('POST /api/user/uploadAvatar', function () {
    it('should update an avatar to Imgur', function (done) {
      request(app)
      .post('/api/user/uploadAvatar')
      .set('cookie', cookie)
      .send({'url': 'http://i.imgur.com/BS2iaX2.jpg'})
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (error, res) {
        if (error) {
          return done(error);
        }
        res.should.have.status(200);
        assert.equal(res.body.message, 'Avatar updated.');
        done();
      });
    });
  });
});