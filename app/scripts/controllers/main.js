'use strict';

angular.module('linesPerBeatApp').controller('MainCtrl', ['$scope', 'UserService', '$materialToast', function ($scope, UserService, $materialToast) {
  UserService.getParticipants().success(function (userList) {
    $scope.userList = userList;
  }).error(function (error) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
    });
  });
}]);

angular.module('linesPerBeatApp').controller('LoginCtrl', ['$scope', 'UserService', '$location', '$timeout', '$window', '$materialToast', '$rootScope', function ($scope, UserService, $location, $timeout, $window, $materialToast, $rootScope) {
  $scope.login = function() {
    var loginData = {
      username: $scope.username,
      password: $scope.password
    };
    UserService.login(loginData).success(function (loginResp) {
      $window.localStorage.setItem('user', $scope.username);
      $materialToast({
        template: loginResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $rootScope.isLoggedIn = true;
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);

angular.module('linesPerBeatApp').controller('RegisterCtrl', ['$scope', 'UserService', '$location', '$timeout', '$window', '$materialToast', function ($scope, UserService, $location, $timeout, $window, $materialToast) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    UserService.register(registerData).success(function (registerResp) {
      $materialToast({
        template: registerResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $window.localStorage.setItem('user', $scope.username);
      $timeout(function () {
        $location.path('/linkLastFm');
      }, 500);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);

angular.module('linesPerBeatApp').controller('GruntFileCtrl', [function () {}]);

angular.module('linesPerBeatApp').controller('LinkLastFmCtrl', ['$scope', 'UserService', '$location', '$timeout', '$materialToast', function ($scope, UserService, $location, $timeout, $materialToast) {
  $scope.linkAccount = function() {
    var linkData = {
      lastfmUser: $scope.lastfmUser
    };
    UserService.linkAccount(linkData).success(function (linkResp) {
      $materialToast({
        template: linkResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $timeout(function () {
        $location.path('/getGruntFile');
      }, 500);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
  $scope.tooltip = {
    'title': 'Your Last.FM Account is used to track your scrobbles in realtime.'
  };
}]);

angular.module('linesPerBeatApp').controller('EditProfileCtrl', ['$scope', 'UserService', '$timeout', '$location', '$materialToast', function ($scope, UserService, $timeout, $location, $materialToast) {
  UserService.getProfile().success(function (profileResp) {
    $scope.firstName = profileResp.firstName;
    $scope.lastName = profileResp.lastName;
    $scope.lastfmUser = profileResp.lastfm.username;
  }).error(function (error) {
    $materialToast({
      template: error.message,
      duration: 2000,
      position: 'left bottom'
    });
  });
  $scope.editProfile = function() {
    var profileData = {
      firstName: $scope.firstName,
      lastName: $scope.lastName,
      lastfmUser: $scope.lastfmUser
    };
    UserService.updateProfile(profileData).success(function (profileResp) {
      $materialToast({
        template: profileResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);

angular.module('linesPerBeatApp').controller('ChangePasswordCtrl', ['$scope', 'UserService', '$timeout', '$location', '$materialToast', function ($scope, UserService, $timeout, $location, $materialToast) {
  $scope.changePassword = function() {
    var passwordData = {
      oldPassword: $scope.oldPassword,
      newPassword: $scope.newPassword,
      confirmNewPassword: $scope.confirmNewPassword
    };
    UserService.changePassword(passwordData).success(function (passwordResp) {
      $materialToast({
        template: passwordResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);