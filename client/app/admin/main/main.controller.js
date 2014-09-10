'use strict';

angular.module('linesPerBeatApp')
  .controller('AdminMainCtrl', ['$scope', 'Adminservice', '$location', '$materialToast', 'Userservice', '$materialDialog', '$window', '$rootScope', function ($scope, Adminservice, $location, $materialToast, Userservice, $materialDialog, $window, $rootScope) {
  Userservice.getParticipants().success(function (userList) {
    Adminservice.getProcesses().success(function (processList) {
      try {
        $scope.userList = $scope.mergeByProperty(userList, processList, 'username');
      } catch(e) {
        $materialToast({
          controller: 'ToastCtrl',
          templateUrl: 'components/toast/toast.html',
          position: 'bottom left',
          locals: {
            closeTime: 4000,
            message: e.message
         }
        });
      }
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
  $scope.$on('deleteAccount', function (event, data) {
    if($scope.userList) {
      $scope.userList.splice(data.index, 1);
    }
  });
  $scope.mergeByProperty = function(arr1, arr2, prop) {
    if(arr1.length !== arr2.length) {
      throw new Error('UserList and ProcessList are not the same length, restart processes for users missing it.');
    }
    for(var i = 0; i < arr2.length; i++) {
      var arr1Obj;
      if(arr1[i][prop] === arr2[i][prop]) {
        arr1Obj = arr1[i];
      }
      if(arr1Obj) {
        angular.extend(arr1[i], arr2[i]);
      } else {
        arr1.push(arr2[i]);
      }
    }
    return arr1;
  };
  $scope.openProcessModal = function(pid, username, e) {
    $materialDialog({
      templateUrl: 'app/admin/main/modals/process.html',
      targetEvent: e,
      controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
        $scope.user = username;
        $scope.pid = pid;
        $scope.close = function () {
          var processData = {
            pid: $scope.pid
          };
          Adminservice.deleteProcess(processData).success(function (processResponse) {
            $materialToast({
              controller: 'ToastCtrl',
              templateUrl: 'components/toast/toast.html',
              position: 'bottom left',
              locals: {
                closeTime: 700,
                message: processResponse.message
             }
            });
            $hideDialog();
          }).error(function (error, statusCode){
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
              $location.path('/login');
            }
          });
        };
      }]
    });
  };
  $scope.openDeleteModal = function(username, index, e) {
    if(username === $window.localStorage.getItem('user')) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: 'Can\'t delete your own account.'
       }
      });
    } else {
      $materialDialog({
        templateUrl: 'app/admin/main/modals/delete.html',
        targetEvent: e,
        controller: ['$scope', '$hideDialog', function ($scope, $hideDialog) {
          $scope.user = username;
          $scope.close = function () {
            var userData = {
              username: $scope.user
            };
            Adminservice.deleteAccount(userData).success(function (deleteResp) {
              $materialToast({
                controller: 'ToastCtrl',
                templateUrl: 'components/toast/toast.html',
                position: 'bottom left',
                locals: {
                  closeTime: 700,
                  message: deleteResp.message
               }
              });
              $rootScope.$broadcast('deleteAccount', {index: index});
              $hideDialog();
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
                $location.path('/login');
              }
            });
          };
        }]
      });
    }
  };
}]);
