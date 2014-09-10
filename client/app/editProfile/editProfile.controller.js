'use strict';

angular.module('linesPerBeatApp')
  .controller('EditprofileCtrl', ['$scope', 'Userservice', '$timeout', '$location', '$materialToast', '$window', '$route', function ($scope, Userservice, $timeout, $location, $materialToast, $window, $route) {
  Userservice.getProfile().success(function (profileResp) {
    $scope.firstName = profileResp.firstName;
    $scope.lastName = profileResp.lastName;
    $scope.lastfmUser = profileResp.lastfm.username;
  }).error(function (error, statusCode) {
    $materialToast({
      controller: 'ToastCtrl',
      templateUrl: 'components/toast/toast.html',
      position: 'bottom left',
      locals: {
        closeTime: 2000,
        message: error.message
     }
    });
    if(statusCode === 401) {
      $window.localStorage.clear();
      $location.path('/');
    }
  });
  $scope.selectedAvatar = 1;
  $scope.show = function(type) {
    if(type === 'upload') {
      $scope.showUpload = true;
    } else {
      $scope.showUpload = false;
    }
  };
  $scope.upload = function() {
    var uploadData = {
      file: $scope.avatarFile,
      url: $scope.url
    };
    Userservice.uploadAvatar(uploadData).success(function (uploadResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 700,
          message: uploadResp.message
       }
      });
      $route.reload();
    }).error(function (error, statusCode) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: error.message
       }
      });
      if(statusCode === 401) {
        $window.localStorage.clear();
        $location.path('/');
      }
    });
  };
  $scope.editProfile = function() {
    var profileData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      lastfmUser: $scope.lastfmUser
    };
    Userservice.updateProfile(profileData).success(function (profileResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 700,
          message: profileResp.message
       }
      });
    }).error(function (error, statusCode) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: error.message
       }
      });
      if(statusCode === 401) {
        $window.localStorage.clear();
        $location.path('/');
      }
    });
  };
}]);
