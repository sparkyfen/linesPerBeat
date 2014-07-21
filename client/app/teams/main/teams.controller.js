'use strict';

angular.module('linesPerBeatApp').controller('TeamsCtrl', ['$scope', 'Teamservice', '$materialToast', function ($scope, Teamservice, $materialToast) {
  Teamservice.getTeams().success(function (teamResponse) {
    $scope.teamList = teamResponse;
  }).error(function (error) {
    $materialToast({
      template: error.message,
      duration: 4000,
      position: 'left bottom'
    });
  });
}]);
