'use strict';

var validator = require('validator');
var imgur = require('imgur-node-api');
var fs = require('fs');
var db = require('../../components/database');
var settings = require('../../config/environment');

db.initialize('couchdb');
imgur.setClientID(settings.imgur.clientId);

var users = db.getUsersTable();

/**
 * Uploads an image to Imgur using their v3 API service.
 *
 * @param  {String} imageURL
 *   The file path or URL of the image.
 * @param  {Function} callback
 *   The callback function to send the data back with.
 *
 * @return
 *   The callback function to send the data back with.
 */
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

// Updates the user's avatar.
exports.index = function(req, res) {
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
 *
 * @param  {String} imagePath
 *   The relative path to the image.
 *
 * @return {Boolean}
 *   Whether the file is an image or not.
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