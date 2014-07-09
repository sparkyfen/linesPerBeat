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
  }).when('/admin', {
    templateUrl: 'partials/admin/main',
    controller: 'AdminMainCtrl'
  }).when('/admin/login', {
    templateUrl: 'partials/admin/login',
    controller: 'AdminLoginCtrl'
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
}).run(function (AdminService, $materialToast, $rootScope, $location) {
  $rootScope.$on('$locationChangeStart', function (event) {
    if($location.path() === '/admin') {
      AdminService.checkCookie().error(function (error) {
        $materialToast({
          template: error.message,
          duration: 2000,
          position: 'left bottom'
        });
        event.preventDefault();
        $location.path('/admin/login');
      });
    }
  });
});