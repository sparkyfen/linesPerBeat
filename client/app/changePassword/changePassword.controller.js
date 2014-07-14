'use strict';

angular.module('linesPerBeatApp')
  .controller('ChangePasswordCtrl', ['$scope', 'Userservice', '$location', '$materialToast', '$window', '$rootScope', function ($scope, Userservice, $location, $materialToast, $window, $rootScope) {
  Userservice.checkCookie().error(function (error, statusCode) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
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
        template: passwordResp.message,
        duration: 700,
        position: 'left bottom'
      });
      // Clear user out of localstorage.
      $window.localStorage.clear();
      $rootScope.$emit('isLoggedIn', {value: false});
      // TODO Reset the navbar after the user changes their password. The Login word appears but the secondary menu still displays.
      $location.path('/');
    }).error(function (error, statusCode) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
      if(statusCode === 401) {
        $window.localStorage.clear();
        $location.path('/');
      }
    });
  };
}]);
