var mime = require('mime');
var validator = require('validator');
var settings = require('../config/config');
var db = require('../database');
var bcrypt = require('bcrypt');
var uuid = require('node-uuid');
var fs = require('fs');
var url = require('url');
var imgur = require('imgur-node-api');
var spawn = require('child_process').spawn;
var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
  api_key: settings.lastfm.api_key,
  secret: settings.lastfm.secret,
  useragent: settings.lastfm.useragent
});
imgur.setClientID(settings.imgur.clientId);

db.initialize('couchdb');
var users = db.getUsersTable();
var childProcesses = db.getChildTable();

/**
 * Creates a singleton that listens to the user's new tracks.
 *
 * @param lastfmUser The last.fm username to listen to.
 */
function kickOffFMListener(lastfmUser, username) {
  var listener = spawn('node', [__dirname + '/lastfmListener.js', '-l', lastfmUser, '-u', username]);
  console.log('Running new Last.FM Listener Instance with PID ' + listener.pid);
  listener.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  listener.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  listener.on('SIGINT', function () {
    console.log('Closing Process with PID' + listener.pid);
    db.deleteProcessByPid(listener.pid, function (error, reply) {
      if(error) {
        return console.log(error);
      }
      console.log(reply);
    });
    listener.exit();
  });
  listener.on('SIGKILL', function () {
    console.log('Closing Process with PID' + listener.pid);
    db.deleteProcessByPid(listener.pid, function (error, reply) {
      if(error) {
        return console.log(error);
      }
      console.log(reply);
    });
    listener.exit();
  });
  listener.on('exit', function (code, signal) {
    console.log(code);
    console.log(signal);
    db.deleteProcessByPid(listener.pid, function (error, reply) {
      if(error) {
        return console.log(error);
      }
      console.log(reply);
    });
  });

  var user = {
    lastfmUser: lastfmUser,
    username: username
  };
  db.insert(childProcesses, listener.pid, user, function (error) {
    if(error) {
      return console.log(error);
    }
  });
}

function _uploadImage(imageURL, callback) {
  imgur.upload(imageURL, function (error, reply) {
    if(error) {
      return callback(error);
    }
    if(reply.success) {
      return callback(null, reply.data.link);
    } else if (!reply.success && typeof(reply.data.error) === 'object') {
      return callback(reply.data.error.type + ' ' + reply.data.error.message);
    } else {
      return callback(reply.data.error);
    }
  });
}

exports.login = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(password)) {
    return res.json(400, {message: 'Missing password.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem logging user ' + username + ' in.'});
    }
    if(reply.rows.length === 0) {
      return res.json(400, {message: 'Invalid username.'});
    }
    bcrypt.compare(password, reply.rows[0].value.password, function (error, compareResult) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem logging user ' + username + ' in.'});
      }
      if(!compareResult) {
        return res.json(400, {message: 'Invalid password.'});
      }
      req.session.username = username;
      return res.json({message: 'Logged in.'});
    });
  });
};

exports.register = function(req, res) {
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
     return res.json(500, {message: 'Problem registering user ' + username + '.'});
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
    linesLastUpdated: Date.now()
   };
   // Check to see if the user id exists (should not because its uuid generated).
   db.peekForUser(userId, function (error, reply) {
    if(error && error.status_code !== 404) {
      console.log(error);
      return res.json(500, {message: 'Problem registering your site.'});
    }
    if(reply) {
      return res.json(400, {message: 'User id already exists.'});
    }
    // Check to see if the username exists.
    db.searchByUser(username, function (error, reply) {
      if(error && error.status_code !== 404) {
        console.log(error);
        return res.json(500, {message: 'Problem registering user ' + username + '.'});
      }
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem registering user ' + username + '.'});
      }
      if(reply.rows.length > 0) {
        return res.json(400, {message: 'User already exists.'});
      }
      // Create user
      var gruntFile = fs.readFileSync(__dirname + '/../../client/Gruntfile.js', {encoding: 'utf8'});
      require('dns').lookup(require('os').hostname(), function (error, address) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem registering user ' + username + ', please try again.'});
        }
        var siteURL = url.resolve("http://" + address + ':' + settings.port, '/api/user/updateLines');
        user.gruntFile = gruntFile.replace("&username&", username).replace('&siteURL&', siteURL);
        db.insert(users, userId, user, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem registering your site.'});
          }
          req.session.username = username;
          return res.json({message: 'Registered.', gruntFile: user.gruntFile});
        });
      });
    });
   });
 });
};

exports.logout = function(req, res) {
  delete req.session.username;
  req.session.destroy(function () {
      return res.json({message: 'Logged out.'});
  });
};

exports.getProfile = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Invalid username.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting profile.'});
    }
    var user = reply.rows[0].value;
    if(!user) {
      console.log('Someone deleted the user fromt the DB? Might have been the server-side tests!');
      return res.json(500, {message: 'Problem getting profile.'});
    }
    delete user._id;
    delete user._rev;
    delete user.password;
    return res.json(user);
  });
};

// TODO Update avatars for users.
exports.updateProfile = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var lastfmUser = req.body.lastfmUser;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(validator.isNull(lastfmUser)) {
    return res.json(400, {message: 'Missing lastfm user.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating profile.'});
    }
    var user = reply.rows[0].value;
    if(!user) {
      console.log('Someone deleted the user fromt the DB? Might have been the server-side tests!');
      return res.json(500, {message: 'Problem updating profile.'});
    }
    var userId = user.id;
    if(user.lastfm.username !== lastfmUser) {
      user.lastfm.username = lastfmUser;
    }
    if(user.lastName !== lastName) {
      user.lastName = lastName;
    }
    if(user.firstName !== firstName) {
      user.firstName = firstName;
    }
    db.insert(users, userId, user, function (error) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem updating profile.'});
      }
      return res.json({message: 'Profile updated.'});
    });
  });
};

exports.changePassword = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  var oldPassword = req.body.oldPassword;
  var newPassword = req.body.newPassword;
  var confirmNewPass = req.body.confirmNewPassword;
  if(validator.isNull(username)) {
    return res.json(400, {message: 'Missing username.'});
  }
  if(newPassword !== confirmNewPass) {
    return res.json(400, {message: 'New passwords mismatch.'});
  }
  if(oldPassword === newPassword) {
    return res.json(400, {message: 'Cannot use old password as new password.'});
  }
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating password.'});
    }
    var user = reply.rows[0].value;
    if(!user) {
      console.log('Someone deleted the user fromt the DB? Might have been the server-side tests!');
      return res.json(500, {message: 'Problem updating password.'});
    }
    bcrypt.compare(oldPassword, user.password, function (error, result) {
      if(error) {
        console.log(error);
        return res.json(400, {message: 'Problem updating password.'});
      }
      if(!result) {
        return res.json(400, {message: 'Invalid old password.'});
      }
      bcrypt.hash(newPassword, 10, function (error, newHash) {
        if(error) {
          console.log(error);
          return res.json(400, {message: 'Problem updating password.'});
        }
        user.password = newHash;
        db.insert(users, user._id, user, function (error) {
          if(error) {
            console.log(error);
            return res.json(500, {message: 'Problem updating password.'});
          }
          delete req.session.username;
          req.session.destroy(function () {
            return res.json({message: 'Password updated.'});
          });
        });
      });
    });
  });
};

exports.linkAccounts = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var lastfmUser = req.body.lastfmUser;
  if(validator.isNull(lastfmUser)) {
    return res.json(400, {message: 'Missing Last.FM username.'});
  }
  var username = req.session.username;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem updating password.'});
    }
    var user = reply.rows[0].value;
    lastfm.request('user.getInfo', {
      user: lastfmUser,
      handlers: {
        success: function(lastfmData) {
          user.lastfm.username = lastfmData.user.name;
          user.lastfm.id = lastfmData.user.id;
          db.insert(users, user.id, user, function (error) {
            if(error) {
              console.log(error);
              return res.json(500, {message: 'Could not link accounts.'});
            }
            kickOffFMListener(user.lastfm.username, user.username);
            return res.json({message: 'Accounts linked.'});
          });
        },
        error: function(error) {
          if(error.code === 6) {
            return res.json(400, {message: error.message});
          } else {
            console.log(error);
            return res.json(400, {message: 'Could not link accounts.'});
          }
        }
      }
    });
  });
};

exports.getParticipants = function(req, res) {
  db.searchUserByAll(function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting the participant list.'});
    }
    var users = [];
    for(var i = 0; i < reply.rows.length; i++) {
      delete reply.rows[i].value._id;
      delete reply.rows[i].value._rev;
      delete reply.rows[i].value.password;
      users.push(reply.rows[i].value);
    }
    return res.json(users);
  });
};

exports.getGruntFile = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem getting grunt file.'});
    }
    var user = reply.rows[0].value;
    var gruntFile = user.gruntFile;
    var fileName = 'gruntFile' + user.username + '.js';
    var filePath = '/tmp/' + fileName;
    fs.writeFileSync(filePath, gruntFile, {encoding: 'utf8'});
    res.download(filePath, fileName, function (error) {
      if(error) {
        if(res.headersSent) {
          return res.send(400);
        } else {
          return res.json(400, {message: 'Missing grunt file.'});
        }
      }
      fs.unlinkSync(filePath);
    });
  });
};

exports.updateLines = function(req, res) {
  var username = res.body.username;
  var currentTime = res.body.currentTime;
  var linesAdded = res.body.linesAdded;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      return console.log(error);
    }
    var user = reply.rows[0].value;
    var lastUpdated = user.linesLastUpdated;
    var timeDifference = currentTime - lastUpdated;
    var timeInMinutes = timeDifference / 1000 / 60;
    var linesPerMinute = linesAdded / timeInMinutes;
    user.linesPerMinute = linesPerMinute;
    db.insert(users, user._id, user, function (error) {
      if(error) {
        return console.log(error);
      }
    });
  });
};

exports.checkCookie = function(req, res) {
  if(!req.session.username) {
      return res.json(401, {message: 'Please sign in.'});
  }
  return res.json({message: 'Valid.'});
};

exports.uploadAvatar = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  var username = req.session.username;
  db.searchByUser(username, function (error, reply) {
    if(error) {
      console.log(error);
      return res.json(500, {message: 'Problem uploading avatar.'});
    }
    var user = reply.rows[0].value;
    var image = req.files.file;
    var imageURL = req.body.url;
    // If the image is a string and its not a url
    if(!validator.isNull(imageURL) && !validator.isURL(imageURL)) {
      return res.json(400, {message: 'Invalid URL.'});
    }
    var imagePath;
    var doUnlink = false;
    if(validator.isURL(imageURL)) {
       imagePath = imageURL;
    } else {
      imagePath = image.path;
      doUnlink = true;
    }
    _uploadImage(imagePath, function (error, link) {
      if(error) {
        return res.json(500, {message: error});
      }
      user.avatar = link;
      db.insert(users, user._id, user, function (error) {
        if(error) {
          console.log(error);
          return res.json(500, {message: 'Problem uploading avatar.'});
        }
        if(doUnlink) {
          fs.unlinkSync(imagePath);
        }
        return res.json({message: 'Avatar updated.'});
      });
    });
  });
};

/**
 * Check local file to see if it's an image file or not.
 * @param  {String} imagePath The relative path to the image
 * @return {Boolean} Whether the file is an image or not
 */
validator.extend('isImage', function (imagePath) {
  var imageType = mime.lookup(imagePath);
  switch(imageType) {
    case 'image/jpeg':
    case 'image/gif':
    case 'image/png':
    case 'image/x-icon':
    return true;
    default:
    return false;
  }
});
