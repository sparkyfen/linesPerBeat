'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/teams', {
        templateUrl: 'app/teams/main/teams.html',
        controller: 'TeamsCtrl'
      });
  });
