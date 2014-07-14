'use strict';

angular.module('linesPerBeatApp')
  .service('Userservice', ['$http', function Userservice($http) {
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
    },
    checkCookie: function() {
      return $http.get('/api/user/checkCookie');
    },
    uploadAvatar: function (uploadData) {
       //By setting ‘Content-Type’: undefined, the browser sets the Content-Type to multipart/form-data for us and fills in the correct boundary. Manually setting ‘Content-Type’: multipart/form-data will fail to fill in the boundary parameter of the request.
      var formData = new FormData();
      formData.append('file', uploadData.file || null);
      formData.append('url', uploadData.url || null);
      return $http({
        method: 'POST',
        url: '/api/user/uploadAvatar',
        data: formData,
        headers: {'Content-Type': undefined},
        transformRequest: angular.identity
      });
    }
  };
}]);
