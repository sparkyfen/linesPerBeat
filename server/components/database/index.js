var settings = require('../../config/environment');

var COUCHDB = 'couchdb';
var DYNAMODB = 'dynamodb';

function allowedDBTypes(type) {
  switch(type.toLowerCase()) {
    case COUCHDB:
    case DYNAMODB:
    return true;
    default:
    return false;
  }
}

exports.initialize = function(type) {
  if(type === undefined) {
    throw new Error('Missing database type.');
  }
  if(allowedDBTypes(type)) {
    this.type = type;
  } else {
    throw new Error('The database type ' + type + 'is not allowed.');
  }
  switch(this.type) {
    case COUCHDB:
    this.nano = require('nano')(settings.couchdb.url);
    this.users = this.nano.use(settings.couchdb.users);
    this.teams = this.nano.use(settings.couchdb.teams);
    this.childProcesses = this.nano.use(settings.couchdb.childProcesses);
    break;
    case DYNAMODB:
    // TODO Add Dyanmo initialization.
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.createDB = function(dbName, callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.create(dbName, function (error, body) {
      if(error) {
        return callback(error);
      }
      return callback(null, body);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.compactUserDB = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.compact(settings.couchdb.users, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.compactTeamDB = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.compact(settings.couchdb.teams, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.compactProcessDB = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.compact(settings.couchdb.childProcesses, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.insert = function(db, key, data, callback) {
  switch(this.type) {
    case COUCHDB:
    db.insert(data, key, function (err) {
      if(err) {
        return callback(err);
      }
      return callback(null);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.getUsersTable = function() {
  switch(this.type) {
    case COUCHDB:
    return this.users;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.getChildTable = function () {
  switch(this.type) {
    case COUCHDB:
    return this.childProcesses;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.getTeamsTable = function () {
  switch(this.type) {
    case COUCHDB:
    return this.teams;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.peekForUser = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.head(userId, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.getUser = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.get(userId, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchByUser = function(username, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchByUserId = function(userId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_id', {reduce: false, startkey: userId, endkey: userId}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchByMultipleUserIds = function(userIds, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'by_id', {reduce: false, keys: userIds}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchByTeamName = function (teamName, callback) {
  switch(this.type) {
    case COUCHDB:
    this.teams.view('teams', 'by_name', {reduce: false, startkey: teamName, endkey: teamName}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchByTeamId = function (teamId, callback) {
  switch(this.type) {
    case COUCHDB:
    this.teams.view('teams', 'by_id', {reduce: false, startkey: teamId, endkey: teamId}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchTeamByAll = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.teams.view('teams', 'all', {reduce: false}, function (error, reply) {
      if (error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.searchUserByAll = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.view('users', 'all', {reduce: false}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteUserByUsername = function(username, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      if(reply.rows.length === 0) {
        return callback('User does not exist.');
      }
      var user = reply.rows[0].value;
      console.log('Deleting user from DB.');
      console.log(user);
      // TODO Delete process from DB when the user is deleted if there is a process running for that user. Implement deleteProcessByUsername().
      _self.users.destroy(user._id, user._rev, function (error, body) {
        if(error) {
          return callback(error);
        }
        return callback(null, body);
      });
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteUserFromTeam = function(teamName, username, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      if(reply.rows.length === 0) {
        return callback('User does not exist.');
      }
      var user = reply.rows[0].value;
      _self.teams.view('teams', 'by_name', {reduce: false, startkey: teamName, endkey: teamName}, function (error, reply) {
        if(error) {
          return callback(error);
        }
        if(reply.rows.length === 0) {
          return callback('Team does not exist.');
        }
        var team = reply.rows[0].value;
        var deleted = false;
        for(var i = 0; i < team.users.length; i++) {
          var teamUser = team.users[i];
          if(teamUser === user._id) {
            team.users.splice(i, 1);
            deleted = true;
          }
        }
        if(!deleted) {
          return callback('User was not in the team, could not delete.');
        }
        _self.teams.insert(team, team._id, function (error) {
          if(error) {
            return callback(error);
          }
          return callback(null);
        });
      });
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteTeamByName = function(teamName, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.teams.view('teams', 'by_name', {reduce: false, startkey: teamName, endkey: teamName}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      if(reply.rows.length === 0) {
        return callback('Team does not exist.');
      }
      var team = reply.rows[0].value;
      console.log('Deleting team from DB.');
      console.log(team);
      _self.teams.destroy(team._id, team._rev, function (error, body) {
        if(error) {
          return callback(error);
        }
        return callback(null, body);
      });
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
}

exports.searchProcessByAll = function(callback) {
  switch(this.type) {
    case COUCHDB:
    this.childProcesses.view('childProcesses', 'all', {reduce: false}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteProcessByPid = function(pid, callback) {
  switch(this.type) {
    case COUCHDB:
    var _self = this;
    _self.childProcesses.view('childProcesses', 'by_pid', {reduce: false, startkey: pid, endkey: pid}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      var cProcess = reply.rows[0].value;
      console.log('Deleting process from DB.');
      console.log(cProcess);
      _self.childProcesses.destroy(cProcess._id, cProcess._rev, function (error, body) {
        if(error) {
          return callback(error);
        }
        return callback(null, body);
      });
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteAllUsers = function(docs, callback) {
  switch(this.type) {
    case COUCHDB:
    this.users.bulk({docs: docs}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteAllTeams = function(docs, callback) {
  switch(this.type) {
    case COUCHDB:
    this.teams.bulk({docs: docs}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};

exports.deleteAllProcesses = function(docs, callback) {
  switch(this.type) {
    case COUCHDB:
    this.childProcesses.bulk({docs: docs}, function (error, reply) {
      if(error) {
        return callback(error);
      }
      return callback(null, reply);
    });
    break;
    case DYNAMODB:
    throw new Error('Dyanmo DB has not been implemented yet.');
    default:
    throw new Error('Only couchdb and dynamodb are allowed.');
  }
};