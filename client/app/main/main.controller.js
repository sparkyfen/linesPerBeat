'use strict';

angular.module('linesPerBeatApp').controller('MainCtrl', ['$scope', 'Userservice', '$materialToast', function ($scope, UserService, $materialToast) {
  UserService.getParticipants().success(function (userList) {
    $scope.userList = userList;
  }).error(function (error) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
    });
  });
}]);