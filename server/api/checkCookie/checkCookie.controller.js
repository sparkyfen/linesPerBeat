'use strict';

// Check user cookie to see if it's valid.
exports.index = function(req, res) {
  if(!req.session.username) {
    return res.json(401, {message: 'Please sign in.'});
  }
  return res.json({message: 'Valid.'});
};