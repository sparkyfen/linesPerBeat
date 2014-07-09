'use strict';

var api = require('./controllers/api'),
    user = require('./controllers/user'),
    admin = require('./controllers/admin'),
    index = require('./controllers');

/**
 * Application routes
 */
module.exports = function(app) {

  // Server API Routes
  app.route('/api/user/login').post(user.login);
  app.route('/api/user/logout').get(user.logout);
  app.route('/api/user/register').post(user.register);
  app.route('/api/user/getProfile').get(user.getProfile);
  app.route('/api/user/updateProfile').post(user.updateProfile);
  app.route('/api/user/changePassword').post(user.changePassword);
  app.route('/api/user/linkAccounts').post(user.linkAccounts);
  app.route('/api/user/getParticipants').get(user.getParticipants);
  app.route('/api/user/gruntfile.js').get(user.getGruntFile);
  app.route('/api/user/updateLines').post(user.updateLines);
  app.route('/api/user/checkCookie').get(user.checkCookie);
  app.route('/api/user/uploadAvatar').post(user.uploadAvatar);

  app.route('/api/admin/login').post(admin.login);
  app.route('/api/admin/logout').get(admin.logout);
  app.route('/api/admin/checkCookie').get(admin.checkCookie);
  app.route('/api/admin/deleteAccount').post(admin.deleteAccount);


  // All undefined api routes should return a 404
  app.route('/api/*').get(function(req, res) {
    res.send(404);
  });

  // All other routes to use Angular routing in app/scripts/app.js
  app.route('/partials/*').get(index.partials);
  app.route('/*').get(index.index);
};