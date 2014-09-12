'use strict';

angular.module('linesPerBeatApp').controller('ToastCtrl', ['$scope', '$timeout', '$hideToast', 'closeTime', 'message', function ($scope, $timeout, $hideToast, closeTime, message) {
  $scope.message = message;
  $timeout(function () {
    $hideToast();
  }, closeTime);
}]);
