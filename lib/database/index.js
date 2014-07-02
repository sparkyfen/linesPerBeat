var settings = require('../config/config');
var exceptions = require('../exceptions');

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
    throw new exceptions.IllegalArgumentException('Missing database type.');
  }
  if(allowedDBTypes(type)) {
    this.type = type;
  } else {
    throw new exceptions.IllegalArgumentException('The database type ' + type + 'is not allowed.');
  }
  switch(this.type) {
    case COUCHDB:
    this.nano = require('nano')(settings.couchdb.url);
    this.users = this.nano.use(settings.couchdb.users);
    break;
    case DYNAMODB:
    // TODO Add Dyanmo initialization.
    throw new Error('Dynamo DB has not been implemented yet.');
  }
};

exports.createDB = function(dbName, callback) {
  switch(this.type) {
    case COUCHDB:
    this.nano.db.create(dbName, function(err, body) {
      if(err) {
        return callback(err);
      }
      return callback(null, body);
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
    this.users.view('users', 'by_username', {reduce: false, startkey: username, endkey: username + '\u9999'}, function (error, reply) {
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

exports.searchByAll = function(callback) {
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