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
    this.childProcesses = this.nano.use(settings.couchdb.childProcesses);
    break;
    case DYNAMODB:
    // TODO Add Dyanmo initialization.
    throw new Error('Dynamo DB has not been implemented yet.');
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
  }
};

exports.getUsersTable = function() {
  switch(this.type) {
    case COUCHDB:
    return this.users;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
  }
};

exports.getChildTable = function () {
  switch(this.type) {
    case COUCHDB:
    return this.childProcesses;
    case DYNAMODB:
    throw new Error('Dynamo DB has not been implemented yet.');
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
  }
};

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
  }
};