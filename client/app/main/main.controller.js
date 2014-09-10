'use strict';

angular.module('linesPerBeatApp').controller('MainCtrl', ['$scope', 'Userservice', '$materialToast', function ($scope, UserService, $materialToast) {
  UserService.getParticipants().success(function (userList) {
    $scope.userList = userList;
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
}]);