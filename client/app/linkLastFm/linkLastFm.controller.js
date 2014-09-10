'use strict';

angular.module('linesPerBeatApp')
  .controller('LinklastfmCtrl', ['$scope', 'Userservice', '$location', '$timeout', '$materialToast', '$window', function ($scope, Userservice, $location, $timeout, $materialToast, $window) {
  $scope.linkAccount = function() {
    var linkData = {
      lastfmUser: $scope.lastfmUser
    };
    Userservice.linkAccount(linkData).success(function (linkResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 700,
          message: linkResp.message
       }
      });
      $location.path('/getGruntFile');
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
  // TODO Add Material Tooltip when it's available.
  $scope.tooltip = {
    'title': 'Your Last.FM Account is used to track your scrobbles in realtime.'
  };
}]);
