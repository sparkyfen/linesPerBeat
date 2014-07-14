'use strict';

angular.module('linesPerBeatApp')
  .controller('GruntfileCtrl', ['$scope', '$location', '$materialToast', function ($scope, $location, $materialToast) {
  $scope.finishRegistration = function() {
    $materialToast({
      template: 'Registration complete.',
      duration: 1000,
      position: 'left bottom'
    });
    $location.path('/');
  };
}]);
