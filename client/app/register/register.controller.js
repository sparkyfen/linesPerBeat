'use strict';

angular.module('linesPerBeatApp')
  .controller('RegisterCtrl', ['$scope', 'Userservice', '$location', '$timeout', '$window', '$materialToast', '$rootScope', function ($scope, Userservice, $location, $timeout, $window, $materialToast, $rootScope) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    Userservice.register(registerData).success(function (registerResp) {
      $window.localStorage.setItem('user', $scope.username);
      $materialToast({
        template: registerResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $rootScope.$emit('isLoggedIn', {value: true, user: $scope.username});
      $location.path('/linkLastFm');
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);
