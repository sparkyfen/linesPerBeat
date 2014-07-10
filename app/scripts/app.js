'use strict';

angular.module('linesPerBeatApp', ['ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'ngAnimate', 'ngMaterial']).config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/home',
    controller: 'HomeCtrl'
  }).when('/admin/register', {
    templateUrl: 'partials/admin/register',
    controller: 'AdminRegisterCtrl'
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
  }).otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
}).run(function (AdminService, $materialToast, $rootScope, $location) {
  var adminRoutes = ['/admin', '/admin/register'];
  $rootScope.$on('$locationChangeStart', function (event) {
    if(adminRoutes.indexOf($location.path()) !== -1) {
      AdminService.checkCookie().error(function (error) {
        $materialToast({
          template: error.message,
          duration: 2000,
          position: 'left bottom'
        });
        event.preventDefault();
        $location.path('/login');
      });
    }
  });
});