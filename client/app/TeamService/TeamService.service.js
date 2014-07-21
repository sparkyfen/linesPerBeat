'use strict';

angular.module('linesPerBeatApp').service('Teamservice', ['$http', function Teamservice($http) {
  return {
    getTeams: function() {
      return $http.get('/api/team/getTeams');
    }
  };
}]);
