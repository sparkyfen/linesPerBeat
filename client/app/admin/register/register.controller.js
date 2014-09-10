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
        template: '<material-toast>' + registerResp.message + '</material-toast>',
        duration: 700,
        position: 'left bottom'
      });
      $rootScope.$emit('isLoggedIn', {value: true, user: $scope.username});
      // TODO This redirect never lands because the $emit fires $watch which fires a $location.path as well to the root page.
      $location.path('/linkLastFm');
    }).error(function (error) {
      $materialToast({
        template: '<material-toast>' + error.message + '</material-toast>',
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);
