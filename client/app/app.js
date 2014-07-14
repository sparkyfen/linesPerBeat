'use strict';

angular.module('linesPerBeatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngMaterial'
]).config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }).run(function (Adminservice, $materialToast, $rootScope, $location) {
  var adminRoutes = ['/admin', '/admin/register'];
  $rootScope.$on('$locationChangeStart', function (event) {
    if(adminRoutes.indexOf($location.path()) !== -1) {
      Adminservice.checkCookie().error(function (error) {
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