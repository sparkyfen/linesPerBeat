'use strict';

angular.module('linesPerBeatApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate', 'ngMaterial']).config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/main',
    controller: 'MainCtrl'
  }).when('/register', {
    templateUrl: 'partials/register',
    controller: 'RegisterCtrl'
  }).when('/login', {
    templateUrl: 'partials/login',
    controller: 'LoginCtrl'
  }).when('/getGruntFile', {
    templateUrl: 'partials/getGruntFile',
    controller: 'GruntFileCtrl'
  }).when('/linkLastFm', {
    templateUrl: 'partials/linkLastFm',
    controller: 'LinkLastFmCtrl'
  }).when('/user/editProfile', {
    templateUrl: 'partials/user/editProfile',
    controller: 'EditProfileCtrl'
  }).when('/user/changePassword', {
    templateUrl: 'partials/user/changePassword',
    controller: 'ChangePasswordCtrl'
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
});