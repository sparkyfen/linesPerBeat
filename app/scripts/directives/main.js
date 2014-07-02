/* global $ */
'use strict';

angular.module('linesPerBeatApp').directive('alert', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'partials/alert.html',
    link: function(scope, element) {
      scope.$on('alert', function (event, alertData) {
        scope.isAlertSuccess = alertData.isSuccess;
        scope.isAlertError = alertData.isError;
        scope.message = alertData.message;
        scope.$apply();
        $(element).fadeIn('fast');
        $timeout(function () {
          $(element).fadeOut('slow', function () {
            scope.message = null;
          });
        }, 3000);
      });
    }
  };
}]);