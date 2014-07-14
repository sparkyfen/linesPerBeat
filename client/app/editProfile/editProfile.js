'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/user/editProfile', {
        templateUrl: 'app/editProfile/editProfile.html',
        controller: 'EditprofileCtrl'
      });
  });
