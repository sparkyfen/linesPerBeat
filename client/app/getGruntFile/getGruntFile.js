'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/getGruntFile', {
        templateUrl: 'app/getGruntFile/getGruntFile.html',
        controller: 'GruntfileCtrl'
      });
  });
