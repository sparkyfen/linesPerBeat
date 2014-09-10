'use strict';

angular.module('linesPerBeatApp')
  .controller('GruntfileCtrl', ['$scope', '$location', '$materialToast', function ($scope, $location, $materialToast) {
  $scope.finishRegistration = function() {
    $materialToast({
      controller: 'ToastCtrl',
      templateUrl: 'components/toast/toast.html',
      position: 'bottom left',
      locals: {
        closeTime: 1000,
        message: 'Registration complete.'
     }
    });
    $location.path('/');
  };
}]);
