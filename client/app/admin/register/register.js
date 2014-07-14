'use strict';

angular.module('linesPerBeatApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/register', {
        templateUrl: 'app/admin/register/register.html',
        controller: 'AdminRegisterCtrl'
      });
  });
