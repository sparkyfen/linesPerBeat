'use strict';

angular.module('linesPerBeatApp').controller('NavbarCtrl', ['$scope', '$location', 'UserService', '$rootScope', '$window', '$timeout', function ($scope, $location, UserService, $rootScope, $window, $timeout) {
  if($window.localStorage.getItem('user') !== null) {
    $rootScope.isLoggedIn = true;
  } else {
    $rootScope.isLoggedIn = false;
  }
  $scope.menu = [{
    'title': 'Home',
    'link': '/'
  },{
    'title': 'Register',
    'link': '/register'
  }];
  $scope.username = $window.localStorage.getItem('user');
  $scope.isActive = function(route) {
    return route === $location.path();
  };
  $scope.logout = function() {
    UserService.logout().success(function (logoutResp) {
      $scope.$emit('alert', {message: logoutResp.message, isError: false, isSuccess: true});
      $window.localStorage.clear();
      $timeout(function () {
        $location.path('/');
      }, 500);
    }).error(function (error) {
      $scope.$emit('alert', {message: error.message, isError: true, isSuccess: false});
    });
  };
}]);
