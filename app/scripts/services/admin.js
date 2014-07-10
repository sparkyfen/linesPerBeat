'use strict';

angular.module('linesPerBeatApp').service('AdminService', ['$http', function ($http) {
  return {
    register: function(registerData) {
      return $http({
        method: 'POST',
        url: '/api/admin/register',
        data: registerData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    checkCookie: function() {
      return $http.get('/api/admin/checkCookie');
    },
    deleteAccount: function (deleteData) {
      return $http({
        method: 'POST',
        url: '/api/admin/deleteAccount',
        data: deleteData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }
  };
}]);