'use strict';

var should = require('should');
var app = require('../../../app');
var request = require('supertest');
var assert = require('assert');
var uuid = require('node-uuid');
var db = require('../../../components/database');
var settings = require('../../../config/environment');
db.initialize('couchdb');
var teams = db.getTeamsTable();

describe('GET /api/team/getTeams', function() {

  beforeEach(function (done) {
    var team = {
      name: 'MockTeam',
      logo: 'http://i.imgur.com/BS2iaX2.jpg',
      users: []
     };
    db.insert(teams, uuid.v4(), team, function (error) {
      if (error) {
        console.log('Error inserting new team.'.red);
        return done(error);
      }
      done();
    });
  });

  afterEach(function (done) {
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

  it('should respond with the list of teams', function(done) {
    request(app)
      .get('/api/team/getTeams')
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