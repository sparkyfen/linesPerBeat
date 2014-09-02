'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var db = require('../../../components/database');
var bcrypt = require('bcrypt');
var settings = require('../../../config/environment');
db.initialize('couchdb');
var users = db.getUsersTable();
var cookie;

describe('GET /api/team/getTeams', function() {

  it('should respond with JSON array', function(done) {
    request(app)
      .get('/api/team/getTeams')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
  });
});