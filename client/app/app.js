'use strict';

angular.module('linesPerBeatApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngAnimate',
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
          controller: 'ToastCtrl',
          templateUrl: 'components/toast/toast.html',
          position: 'bottom left',
          locals: {
            closeTime: 2000,
            message: error.message
         }
        });
        event.preventDefault();
        $location.path('/login');
      });
    }
  });
});