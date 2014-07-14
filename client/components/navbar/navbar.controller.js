'use strict';

angular.module('linesPerBeatApp').controller('NavbarCtrl', ['$scope', '$location', 'Userservice', '$window', '$materialToast', '$rootScope', function ($scope, $location, Userservice, $window, $materialToast, $rootScope) {
  $scope.username = $window.localStorage.getItem('user');
  if($scope.username !== null) {
    $scope.isLoggedIn = true;
  } else {
    $scope.isLoggedIn = false;
  }
  $scope.brand = {
    title: 'Lines-Per-Beat',
    link: '/',
    show: true,
    disabled: false,
    onSelect: function() {
      $location.path(this.link);
    }
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
    show: !$scope.isLoggedIn,
    disabled: false,
    submenu: false
  },{
    title: $scope.username,
    link: '',
    show: $scope.isLoggedIn,
    disabled: false,
    submenu: true
  }];
  $rootScope.$on('isLoggedIn', function (event, reply) {
    // TODO Sometimes the user will show on the navbar, sometimes it won't.
    if(reply.value) {
      $scope.menu[2].show = false;
      $scope.username = reply.user;
      $scope.menu[3].show = true;
      $scope.selectedItem = 0;
    } else {
      $scope.menu[2].show = true;
      $scope.menu[3].show = false;
    }
  });
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
    Userservice.logout().success(function (logoutResp) {
      $materialToast({
        template: logoutResp.message,
        duration: 700,
        position: 'left bottom'
      });
      $window.localStorage.clear();
      $scope.$emit('isLoggedIn', {value: false});
      $scope.selectedItem = 0;
    }).error(function (error) {
      $materialToast({
        template: error.message,
        duration: 2000,
        position: 'left bottom'
      });
    });
  };
}]);
