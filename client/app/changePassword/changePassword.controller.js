'use strict';

angular.module('linesPerBeatApp')
  .controller('ChangePasswordCtrl', ['$scope', 'Userservice', '$location', '$materialToast', '$window', '$rootScope', function ($scope, Userservice, $location, $materialToast, $window, $rootScope) {
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
      $location.path('/');
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
          closeTime: 700,
          message: passwordResp.message
       }
      });
      // Clear user out of localstorage.
      $window.localStorage.clear();
      $rootScope.$emit('isLoggedIn', {value: false});
      // TODO Reset the navbar after the user changes their password. The Login word appears but the secondary menu still displays.
      $location.path('/');
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
        $location.path('/');
      }
    });
  };
}]);
