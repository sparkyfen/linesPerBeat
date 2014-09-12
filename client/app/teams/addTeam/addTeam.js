'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/teams/add', {
        templateUrl: 'app/teams/addTeam/addTeam.html',
        controller: 'AddteamCtrl'
      });
  });
