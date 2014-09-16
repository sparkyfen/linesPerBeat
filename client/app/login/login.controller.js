'use strict';

angular.module('linesPerBeatApp')
  .controller('LoginCtrl', ['$scope', 'Userservice', '$location', '$window', '$materialToast', '$rootScope', function ($scope, Userservice, $location, $window, $materialToast, $rootScope) {
  $scope.login = function() {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    Userservice.login(loginData).success(function (loginResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 1000,
          message: loginResp.message
       }
      });
      $rootScope.$broadcast('loggedIn', {user: $scope.username, admin: loginResp.admin});
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