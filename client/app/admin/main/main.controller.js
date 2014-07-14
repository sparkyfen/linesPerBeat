'use strict';

angular.module('linesPerBeatApp')
  .controller('AdminMainCtrl', ['$scope', 'Adminservice', '$location', '$materialToast', 'Userservice', '$materialDialog', '$window', '$rootScope', function ($scope, Adminservice, $location, $materialToast, Userservice, $materialDialog, $window, $rootScope) {
  Userservice.getParticipants().success(function (userList) {
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
      $scope.userList.splice(data.index, 1);
    }
  });
  $scope.openModal = function(username, index, e) {
    if(username === $window.localStorage.getItem('user')) {
      $materialToast({
        template: 'Can\'t delete your own account.',
        duration: 2000,
        position: 'left bottom'
      });
    } else {
      $materialDialog({
        templateUrl: 'app/admin/main/modals/delete.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', function($scope, $hideDialog) {
          $scope.user = username;
          $scope.close = function() {
            var userData = {
              username: $scope.user
            };
            Adminservice.deleteAccount(userData).success(function (deleteResp) {
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
                $location.path('/login');
              }
            });
          };
        }]
      });
    }
  };
}]);
