'use strict';

angular.module('linesPerBeatApp')
  .controller('EditprofileCtrl',['$scope', 'Userservice', '$timeout', '$location', '$materialToast', '$window', '$route', function ($scope, Userservice, $timeout, $location, $materialToast, $window, $route) {
  Userservice.getProfile().success(function (profileResp) {
    $scope.firstName = profileResp.firstName;
    $scope.lastName = profileResp.lastName;
    $scope.lastfmUser = profileResp.lastfm.username;
  }).error(function (error, statusCode) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
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
        template: uploadResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $route.reload();
    }).error(function (error, statusCode) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
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
        template: profileResp.message,
        duration: 700,
        position: 'left bottom'
      });
    }).error(function (error, statusCode) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
      if(statusCode === 401) {
        $window.localStorage.clear();
        $location.path('/');
      }
    });
  };
}]);
