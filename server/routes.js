/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/admin/deleteProcess', require('./api/admin/deleteProcess'));
  app.use('/api/admin/getProcesses', require('./api/admin/getProcesses'));
  app.use('/api/admin/deleteAccount', require('./api/admin/deleteAccount'));
  app.use('/api/admin/checkCookie', require('./api/admin/checkCookie'));
  app.use('/api/admin/register', require('./api/admin/register'));
  app.use('/api/admin/deleteTeam', require('./api/admin/deleteTeam'));
  app.use('/api/admin/deleteMember', require('./api/admin/deleteMember'));

  app.use('/api/user/uploadAvatar', require('./api/uploadAvatar'));
  app.use('/api/user/checkCookie', require('./api/checkCookie'));
  app.use('/api/user/updateLines', require('./api/updateLines'));
  app.use('/api/user/gruntfile.js', require('./api/getGruntFile'));
  app.use('/api/user/getParticipants', require('./api/getParticipants'));
  app.use('/api/user/linkAccounts', require('./api/linkAccounts'));
  app.use('/api/user/changePassword', require('./api/changePassword'));
  app.use('/api/user/updateProfile', require('./api/updateProfile'));
  app.use('/api/user/getProfile', require('./api/getProfile'));
  app.use('/api/user/register', require('./api/register'));
  app.use('/api/user/logout', require('./api/logout'));
  app.use('/api/user/login', require('./api/login'));

  app.use('/api/team/getTeams', require('./api/team/getTeams'));
  app.use('/api/team/addTeam', require('./api/team/addTeam'));
  app.use('/api/team/addMember', require('./api/team/addMember'));
  app.use('/api/team/getMembers', require('./api/team/getMembers'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
