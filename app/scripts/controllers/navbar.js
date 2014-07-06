'use strict';

angular.module('linesPerBeatApp').controller('NavbarCtrl', ['$scope', '$location', 'UserService', '$rootScope', '$window', '$timeout', '$materialToast', '$route', function ($scope, $location, UserService, $rootScope, $window, $timeout, $materialToast, $route) {
  if($window.localStorage.getItem('user') !== null) {
    $rootScope.isLoggedIn = true;
  } else {
    $rootScope.isLoggedIn = false;
  }
  $scope.username = $window.localStorage.getItem('user');
  $scope.brand = {
    title: 'Lines-Per-Beat',
    link: '/',
    show: true,
    disabled: false,
    submenu: false
  };
  $scope.menu = [{
    title: 'Home',
    link: '/',
    show: true,
    disabled: false,
    submenu: false
  },{
    title: 'Register',
    link: '/register',
    show: true,
    disabled: false,
    submenu: false
  },{
    title: 'Login',
    link: '/login',
    show: !$rootScope.isLoggedIn,
    disabled: false,
    submenu: false
  },{
    title: $scope.username,
    link: '',
    show: $rootScope.isLoggedIn,
    disabled: false,
    submenu: true
  }];
  $scope.usermenu = [{
    title: 'Edit Profile',
    link: '/user/editProfile',
    show: true,
    disabled: false,
    onSelect: function() {
      $location.path(this.link);
    }
  },{
    title: 'Change Password',
    link: '/user/changePassword',
    show: true,
    disabled: false,
    onSelect: function() {
      $location.path(this.link);
    }
  },{
    title: 'Logout',
    link: '',
    show: true,
    disabled: false,
    onSelect: function() {
      $scope.logout();
    }
  }];
  $scope.$watch('selectedItem', function (index) {
    if(index !== undefined) {
      $scope.selectedItem = index;
      $location.path($scope.menu[index].link);
    }
  });
  $scope.logout = function () {
    UserService.logout().success(function (logoutResp) {
      $materialToast({
        template: logoutResp.message,
        duration: 500,
        position: 'left bottom'
      });
      $window.localStorage.clear();
      $rootScope.isLoggedIn = false;
      $timeout(function () {
        $route.reload();
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
