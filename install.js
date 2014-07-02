var colors = require('colors');

var settings = require('./lib/config/config');
var db = require('./lib/database');
db.initialize('couchdb');

var userView = {views: {"all": {"map": "function(doc) {emit(null, doc) }","reduce": "_count"},"by_username": {"map": "function(doc) {emit(doc.username, doc) }","reduce": "_count"}}};
db.createDB(settings.couchdb.users, function (err, body) {
  if(err && err.status_code !== 412) {
    return console.log(err);
  }
  var users = db.getUsersTable();
  // Insert views to make lookup calls with.
  db.insert(users, '_design/users', userView, function (err) {
    // 409 is Document update conflict.
    if(err && err.status_code !== 409) {
      console.log('Error recreating database.'.red);
      console.log(err);
      return;
    }
    console.log('DB Installation successful.'.green);
  });
});