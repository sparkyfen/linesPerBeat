'use strict';

angular.module('linesPerBeatApp')
  .service('Adminservice', ['$http', function Adminservice($http) {
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
    },
    getProcesses: function() {
      return $http.get('/api/admin/getProcesses');
    },
    deleteProcess: function (processData) {
      return $http({
        method: 'POST',
        url: '/api/admin/deleteProcess',
        data: processData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    }
  };
}]);
