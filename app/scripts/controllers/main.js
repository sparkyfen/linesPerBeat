'use strict';

angular.module('linesPerBeatApp').controller('MainCtrl', ['$scope', 'UserService', function ($scope, UserService) {
  UserService.getParticipants().success(function (userList) {
    $scope.userList = userList;
  }).error(function (error) {
    $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
  });
}]);

angular.module('linesPerBeatApp').controller('LoginCtrl', ['$scope', 'UserService', '$location', '$timeout', '$window', function ($scope, UserService, $location, $timeout, $window) {
  $scope.login = function() {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    UserService.login(loginData).success(function (loginResp) {
      $scope.$emit('alert', {message: loginResp.message, isError: false, isSuccess: true});
      $window.localStorage.setItem('user', $scope.username);
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
}]);

angular.module('linesPerBeatApp').controller('RegisterCtrl', ['$scope', 'UserService', '$location', '$timeout', '$window', function ($scope, UserService, $location, $timeout, $window) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    UserService.register(registerData).success(function (registerResp) {
      $scope.$emit('alert', {message: registerResp.message, isError: false, isSuccess: true});
      $window.localStorage.setItem('user', $scope.username);
      $timeout(function () {
        $location.path('/linkLastFm');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
}]);

angular.module('linesPerBeatApp').controller('GruntFileCtrl', [function () {}]);

angular.module('linesPerBeatApp').controller('LinkLastFmCtrl', ['$scope', 'UserService', '$location', '$timeout', function ($scope, UserService, $location, $timeout) {
  $scope.linkAccount = function() {
    var linkData = {
      lastfmUser: $scope.lastfmUser
    };
    UserService.linkAccount(linkData).success(function (linkResp) {
      $scope.$emit('alert', {message: linkResp.message, isError: false, isSuccess: true});
      $timeout(function () {
        $location.path('/getGruntFile');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
  $scope.tooltip = {
    'title': 'Your Last.FM Account is used to track your scrobbles in realtime.'
  };
}]);

angular.module('linesPerBeatApp').controller('EditProfileCtrl', ['$scope', 'UserService', '$timeout', '$location', function ($scope, UserService, $timeout, $location) {
  UserService.getProfile().success(function (profileResp) {
    $scope.firstName = profileResp.firstName;
    $scope.lastName = profileResp.lastName;
    $scope.lastfmUser = profileResp.lastfm.username;
  }).error(function (error) {
    $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
  });
  $scope.editProfile = function() {
    var profileData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      lastfmUser: $scope.lastfmUser
    };
    UserService.updateProfile(profileData).success(function (profileResp) {
      $scope.$emit('alert', {message: profileResp.message, isError: false, isSuccess: true});
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
}]);

angular.module('linesPerBeatApp').controller('ChangePasswordCtrl', ['$scope', 'UserService', '$timeout', '$location', function ($scope, UserService, $timeout, $location) {
  $scope.changePassword = function() {
    var passwordData = {
      oldPassword: $scope.oldPassword,
      newPassword: $scope.newPassword,
      confirmNewPassword: $scope.confirmNewPassword
    };
    UserService.changePassword(passwordData).success(function (passwordResp) {
      $scope.$emit('alert', {message: passwordResp.message, isError: false, isSuccess: true});
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
}]);