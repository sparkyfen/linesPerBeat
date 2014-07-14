'use strict';

// Logs the user out of the site.
exports.index = function(req, res) {
  delete req.session.username;
  if (req.session.isAdmin) {
    delete req.session.isAdmin;
  }
  req.session.destroy(function (error) {
    if (error) {
      console.log(error);
      return res.json(500, {message: 'Problem logging user out.'});
    }
    return res.json({message: 'Logged out.'});
  });
};