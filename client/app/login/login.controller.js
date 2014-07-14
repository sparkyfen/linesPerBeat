'use strict';

angular.module('linesPerBeatApp')
  .controller('LoginCtrl', ['$scope', 'Userservice', '$location', '$timeout', '$window', '$materialToast', '$rootScope', function ($scope, Userservice, $location, $timeout, $window, $materialToast, $rootScope) {
  $scope.login = function() {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    Userservice.login(loginData).success(function (loginResp) {
      $window.localStorage.setItem('user', $scope.username);
      $materialToast({
        template: loginResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $rootScope.$emit('isLoggedIn', {value: true, user: $scope.username});
      $location.path('/');
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);
