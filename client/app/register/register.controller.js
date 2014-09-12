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
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 1000,
          message: registerResp.message
       }
      });
      $location.path('/linkLastFm');
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
