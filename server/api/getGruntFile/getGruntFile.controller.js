'use strict';

var fs = require('fs');
var url = require('url');
var UglifyJS = require("uglify-js");
var zip = new require('node-zip')();
var settings = require('../../config/environment');
var db = require('../../components/database');

db.initialize('couchdb');

// Gets the user's GruntFile.js to watch their code changes.
exports.index = function(req, res) {
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
    var gruntFile = fs.readFileSync(__dirname + '/../../components/gruntfile/Gruntfile.js', {encoding: 'utf8'});
    require('dns').lookup(require('os').hostname(), function (error, address) {
      if(error) {
        console.log(error);
        return res.json(500, {message: 'Problem getting grunt file.'});
      }
      var protocol = settings.port === 443 ? "https://" : "http://";
      var siteURL = url.resolve(protocol + address + ':' + settings.port, '/api/user/updateLines');
      gruntFile = gruntFile.replace(/&username&/g, username).replace(/&siteURL&/g, siteURL);
      gruntFile = UglifyJS.minify(gruntFile, {fromString: true}).code;
      var packageFile = fs.readFileSync(__dirname + '/../../components/gruntfile/package.json', {encoding: 'utf8'});
      var options = {base64: false, compression:'DEFLATE'};
      var fileName = 'gruntFile' + user.username + '.js';
      var zipName = 'gruntFile' + user.username + '.zip';
      var zipPath = '/tmp/' + zipName;
      zip.file(fileName, gruntFile);
      zip.file('package.json', packageFile);
      var data = zip.generate(options);
      fs.writeFileSync(zipPath, data, 'binary');
      res.download(zipPath, zipName, function (error) {
        fs.unlinkSync(zipPath);
        if(error) {
          console.log(error);
          if(res.headersSent) {
            return res.send(400);
          } else {
            return res.json(400, {message: 'Missing grunt file.'});
          }
        }
      });
    });
  });
};