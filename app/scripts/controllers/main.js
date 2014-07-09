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
        duration: 700,
        position: 'left bottom'
      });
      $rootScope.$emit('isLoggedIn', {value: true, user: $scope.username});
      $timeout(function () {
        $location.path('/');
      }, 700);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);

angular.module('linesPerBeatApp').controller('RegisterCtrl', ['$scope', 'UserService', '$location', '$timeout', '$window', '$materialToast', '$rootScope', function ($scope, UserService, $location, $timeout, $window, $materialToast, $rootScope) {
  $scope.register = function() {
    var registerData = {
      username: $scope.username,
      password: $scope.password,
      confirmPassword: $scope.confirmPassword
    };
    UserService.register(registerData).success(function (registerResp) {
      $window.localStorage.setItem('user', $scope.username);
      $materialToast({
        template: registerResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $rootScope.$emit('isLoggedIn', {value: true, user: $scope.username});
      $timeout(function () {
        $location.path('/linkLastFm');
      }, 700);
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);

angular.module('linesPerBeatApp').controller('GruntFileCtrl', ['$scope', '$location', '$materialToast', function ($scope, $location, $materialToast) {
  $scope.finishRegistration = function() {
    $materialToast({
      template: 'Registration complete.',
      duration: 1000,
      position: 'left bottom'
    });
    $location.path('/');
  };
}]);

angular.module('linesPerBeatApp').controller('LinkLastFmCtrl', ['$scope', 'UserService', '$location', '$timeout', '$materialToast', '$window', function ($scope, UserService, $location, $timeout, $materialToast, $window) {
  $scope.linkAccount = function() {
    var linkData = {
      lastfmUser: $scope.lastfmUser
    };
    UserService.linkAccount(linkData).success(function (linkResp) {
      $materialToast({
        template: linkResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $timeout(function () {
        $location.path('/getGruntFile');
      }, 700);
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
  $scope.tooltip = {
    'title': 'Your Last.FM Account is used to track your scrobbles in realtime.'
  };
}]);

angular.module('linesPerBeatApp').controller('EditProfileCtrl', ['$scope', 'UserService', '$timeout', '$location', '$materialToast', '$window', '$route', function ($scope, UserService, $timeout, $location, $materialToast, $window, $route) {
  UserService.getProfile().success(function (profileResp) {
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
    UserService.uploadAvatar(uploadData).success(function (uploadResp) {
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
    UserService.updateProfile(profileData).success(function (profileResp) {
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

angular.module('linesPerBeatApp').controller('ChangePasswordCtrl', ['$scope', 'UserService', '$timeout', '$location', '$materialToast', '$window', function ($scope, UserService, $timeout, $location, $materialToast, $window) {
  UserService.checkCookie().error(function (error, statusCode) {
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
  $scope.changePassword = function() {
    var passwordData = {
      oldPassword: $scope.oldPassword,
      newPassword: $scope.newPassword,
      confirmNewPassword: $scope.confirmNewPassword
    };
    UserService.changePassword(passwordData).success(function (passwordResp) {
      $materialToast({
        template: passwordResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $timeout(function () {
        // Clear user out of localstorage.
        $window.localStorage.clear();
        $location.path('/');
      }, 700);
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