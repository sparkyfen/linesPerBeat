'use strict';

angular.module('linesPerBeatApp')
  .controller('LinklastfmCtrl', ['$scope', 'Userservice', '$location', '$timeout', '$materialToast', '$window', function ($scope, Userservice, $location, $timeout, $materialToast, $window) {
  $scope.linkAccount = function() {
    var linkData = {
      lastfmUser: $scope.lastfmUser
    };
    Userservice.linkAccount(linkData).success(function (linkResp) {
      $materialToast({
        template: linkResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $location.path('/getGruntFile');
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
  // TODO Add Material Tooltip when it's available.
  $scope.tooltip = {
    'title': 'Your Last.FM Account is used to track your scrobbles in realtime.'
  };
}]);
