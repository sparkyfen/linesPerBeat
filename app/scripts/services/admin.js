'use strict';

angular.module('linesPerBeatApp').service('AdminService', ['$http', function ($http) {
  return {
    login: function(loginData) {
      return $http({
        method: 'POST',
        url: '/api/admin/login',
        data: loginData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    logout: function() {
      return $http.get('/api/admin/logout');
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