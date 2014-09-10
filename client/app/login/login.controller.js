'use strict';

angular.module('linesPerBeatApp')
  .controller('LoginCtrl', ['$scope', 'Userservice', '$location', '$window', '$materialToast', '$rootScope', function ($scope, Userservice, $location, $window, $materialToast, $rootScope) {
  $scope.login = function() {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    Userservice.login(loginData).success(function (loginResp) {
      $window.localStorage.setItem('user', $scope.username);
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 700,
          message: loginResp.message
       }
      });
      $rootScope.$broadcast('loggedIn', {user: $scope.username});
    }).error(function (error) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: error.message
       }
      });
    });
  };
}]);