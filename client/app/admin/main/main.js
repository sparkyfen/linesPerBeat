'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin', {
        templateUrl: 'app/admin/main/main.html',
        controller: 'AdminMainCtrl'
      });
  });
