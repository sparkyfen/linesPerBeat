var validator = require('validator');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var fs = require('fs');
var url = require('url');
var settings = require('../config/config');
var db = require('../database');
db.initialize('couchdb');

var users = db.getUsersTable();


exports.register = function(req, res) {
  if(req.session.username && !req.session.isAdmin) {
    console.log('User ' + req.session.username + ' attempted to access administrator privileges.');
  }
  db.searchUserByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem registering new admin.'});
    }
    // If they have a username or not, if they don't have admin rights and the DB has a value, they are denied.
    if(!req.session.isAdmin && reply.rows.length > 0) {
      return res.json(401, {message: 'Not an administrator.'});
    }
    var username = req.body.username;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    if(validator.isNull(username)) {
      return res.json(400, {message: 'Missing username.'});
    }
    if(validator.isNull(password) || validator.isNull(confirmPassword)) {
      return res.json(400, {message: 'Missing password(s).'});
    }
    if(password !== confirmPassword) {
      return res.json(400, {message: 'Passwords don\'t match.'});
    }
    bcrypt.hash(password, 10, function (error, hash) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem registering admin ' + username + '.'});
      }
      var userId = uuid.v4();
      var user = {
        username: username,
        password: hash,
        firstName: firstName || '',
        lastName: lastName || '',
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
       // Check to see if the user id exists (should not because its uuid generated).
       db.peekForUser(userId, function (error, reply) {
        if(error && error.status_code !== 404) {
          console.log(error);
          return res.json(500, {message: 'Problem registering admin ' + username + '.'});
        }
        if(reply) {
          return res.json(400, {message: 'Admin id already exists.'});
        }
        // Check to see if the username exists.
        db.searchByUser(username, function (error, reply) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem registering admin ' + username + '.'});
          }
          if(reply.rows.length > 0) {
            return res.json(400, {message: 'User already exists.'});
          }
          // Create grunt file and populate it with the username and URL for the hackathon.
          var gruntFile = fs.readFileSync(__dirname + '/../../client/Gruntfile.js', {encoding: 'utf8'});
          require('dns').lookup(require('os').hostname(), function (error, address) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Problem registering admin ' + username + ', please try again.'});
            }
            var protocol = settings.port === 443 ? "https://" : "http://";
            var siteURL = url.resolve(protocol + address + ':' + settings.port, '/api/user/updateLines');
            user.gruntFile = gruntFile.replace("&username&", username).replace('&siteURL&', siteURL);
            // Create user
            db.insert(users, userId, user, function (error) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Problem registering admin ' + username + ', please try again.'});
            }
            req.session.username = username;
            req.session.isAdmin = true;
            return res.json({message: 'Registered.'});
            });
          });
        });
      });
    });
  });
};

exports.checkCookie = function(req, res) {
  if(req.session.username && !req.session.isAdmin) {
    console.log('User ' + req.session.username + ' attempted to access administrator privileges.');
  }
  db.searchUserByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem checking admin cookie.'});
    }
    // If they have a username or not, if they don't have admin rights and the DB has a value, they are denied.
    if(!req.session.isAdmin && reply.rows.length > 0) {
      return res.json(401, {message: 'Not an administrator.'});
    }
    return res.json({message: 'Valid.'});
  });
};

exports.deleteAccount = function(req, res) {
  if(!req.session.username || !req.session.isAdmin) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.body.username;
  var requestor = req.session.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(username === requestor) {
    return res.json(400, {message: 'Can\'t delete your own account.'});
  }
  db.deleteUserByUsername(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Could not delete account, check logs.'});
    }
    return res.json({message: 'Account deleted.'});
  });
};