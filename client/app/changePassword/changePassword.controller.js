'use strict';

angular.module('linesPerBeatApp')
  .controller('ChangePasswordCtrl', ['$scope', 'Userservice', '$materialToast', '$window', '$rootScope', function ($scope, Userservice, $materialToast, $window, $rootScope) {
  Userservice.checkCookie().error(function (error, statusCode) {
    $materialToast({
      controller: 'ToastCtrl',
      templateUrl: 'components/toast/toast.html',
      position: 'bottom left',
      locals: {
        closeTime: 2000,
        message: error.message
     }
    });
    if(statusCode === 401) {
      $window.localStorage.clear();
      $rootScope.$emit('loggedOut');
    }
  });
  $scope.changePassword = function() {
    var passwordData = {
      oldPassword: $scope.oldPassword,
      newPassword: $scope.newPassword,
      confirmNewPassword: $scope.confirmNewPassword
    };
    Userservice.changePassword(passwordData).success(function (passwordResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 1000,
          message: passwordResp.message
       }
      });
      // Clear user out of localstorage.
      $window.localStorage.clear();
      $rootScope.$emit('loggedOut');
    }).error(function (error, statusCode) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: error.message
       }
      });
      if(statusCode === 401) {
        $window.localStorage.clear();
        $rootScope.$emit('loggedOut');
      }
    });
  };
}]);
