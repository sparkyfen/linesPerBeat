'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/linkLastFm', {
        templateUrl: 'app/linkLastFm/linkLastFm.html',
        controller: 'LinklastfmCtrl'
      });
  });
