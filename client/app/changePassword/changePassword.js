'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/changePassword', {
        templateUrl: 'app/changePassword/changePassword.html',
        controller: 'ChangePasswordCtrl'
      });
  });
