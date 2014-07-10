'use strict';

angular.module('linesPerBeatApp').controller('AdminRegisterCtrl', ['$scope', 'AdminService', '$rootScope', '$window', '$materialToast', '$location', function ($scope, AdminService, $rootScope, $window, $materialToast, $location) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    AdminService.register(registerData).success(function (registerResp) {
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

angular.module('linesPerBeatApp').controller('AdminMainCtrl', ['$scope', 'AdminService', '$location', '$materialToast', 'UserService', '$materialDialog', '$window', '$rootScope', function ($scope, AdminService, $location, $materialToast, UserService, $materialDialog, $window, $rootScope) {
  UserService.getParticipants().success(function (userList) {
    $scope.userList = userList;
  }).error(function (error) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
    });
  });
  $scope.$on('deleteAccount', function (event, data) {
    if($scope.userList) {
      // TODO The userList item is being deleted but the ng-repeat leaves some HTML elements. (The delete button).
      delete $scope.userList[data.index];
    }
  });
  $scope.openModal = function(username, index) {
    if(username === $window.localStorage.getItem('user')) {
      $materialToast({
        template: 'Can\'t delete your own account.',
        duration: 2000,
        position: 'left bottom'
      });
    } else {
      $materialDialog({
        templateUrl: 'partials/admin/modals/delete.html',
        controller: ['$scope', '$hideDialog', function($scope, $hideDialog) {
          $scope.user = username;
          $scope.close = function() {
            var userData = {
              username: $scope.user
            };
            AdminService.deleteAccount(userData).success(function (deleteResp) {
              $materialToast({
                template: deleteResp.message,
                duration: 700,
                position: 'left bottom'
              });
              $rootScope.$broadcast('deleteAccount', {index: index});
              $hideDialog();
            }).error(function (error, statusCode) {
              $materialToast({
                template: error.message,
                duration: 2000,
                position: 'left bottom'
              });
              if(statusCode === 401) {
                $location.path('/admin/login');
              }
            });
          };
        }]
      });
    }
  };
}]);