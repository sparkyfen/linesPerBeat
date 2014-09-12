'use strict';

angular.module('linesPerBeatApp')
  .controller('GruntfileCtrl', ['$scope', '$materialToast', '$location', function ($scope, $materialToast, $location) {
  $scope.finishRegistration = function() {
    $materialToast({
      controller: 'ToastCtrl',
      templateUrl: 'components/toast/toast.html',
      position: 'bottom left',
      locals: {
        closeTime: 1000,
        message: 'Registration complete, please sign in.'
     }
    });
    $location.path('/');
  };
}]);
