'use strict';

angular.module('linesPerBeatApp').service('UserService', ['$http', function ($http) {
  return {
    login: function(loginData) {
      return $http({
        method: 'POST',
        url: '/api/user/login',
        data: loginData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    logout: function() {
      return $http.get('/api/user/logout');
    },
    register: function(registerData) {
      return $http({
        method: 'POST',
        url: '/api/user/register',
        data: registerData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    getProfile: function() {
      return $http.get('/api/user/getProfile');
    },
    updateProfile: function(profileData) {
      return $http({
        method: 'POST',
        url: '/api/user/updateProfile',
        data: profileData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    changePassword: function(passwordData) {
      return $http({
        method: 'POST',
        url: '/api/user/changePassword',
        data: passwordData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    linkAccount: function(accountData) {
      return $http({
        method: 'POST',
        url: '/api/user/linkAccounts',
        data: accountData,
        header: {'Content-Type': 'application/x-www-form-urlencoded'}
      });
    },
    getParticipants: function() {
      return $http.get('/api/user/getParticipants');
    }
  };
}]);