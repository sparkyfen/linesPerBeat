'use strict';

angular.module('linesPerBeatApp').controller('AdminRegisterCtrl', ['$scope', 'Adminservice', '$rootScope', '$window', '$materialToast', '$location', function ($scope, Adminservice, $rootScope, $window, $materialToast, $location) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    Adminservice.register(registerData).success(function (registerResp) {
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
