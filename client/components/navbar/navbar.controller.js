'use strict';

angular.module('linesPerBeatApp').controller('NavbarCtrl', ['$scope', '$location', 'Userservice', '$window', '$materialToast', '$rootScope', '$timeout', '$materialSidenav', function ($scope, $location, Userservice, $window, $materialToast, $rootScope, $timeout, $materialSidenav) {
  $scope.openMenu = function() {
    $materialSidenav('left').toggle();
  };
  $scope.menu = [{
    title: 'Home',
    link: '/',
    active: $location.path() === this.link,
    disabled: false,
    submenu: false,
    brand: false,
    show: true
  },{
    title: 'Teams',
    link: '/teams',
    show: true,
    disabled: false,
    submenu: false
  },{
    title: 'Register',
    link: '/register',
    active: $location.path() === this.link,
    disabled: false,
    show: true
  },{
    title: 'Login',
    link: '/login',
    active: $location.path() === this.link,
    disabled: false,
    show: true
  },{
    title: 'Edit Profile',
    link: '/user/editProfile',
    active: $location.path() === this.link,
    disabled: false,
    show: false
  },{
    title: 'Change Password',
    link: '/user/changePassword',
    active: $location.path() === this.link,
    disabled: false,
    show: false
  },{
    title: 'Logout',
    link: '',
    active: false,
    disabled: false,
    show: false
  },{
    title: '',
    link: '',
    active: false,
    disabled: true,
    show: false
  },{
    title: 'Admin',
    link: '/admin',
    active: false,
    disabled: false,
    show: false
  },{
    title: 'Admin Register',
    link: '/admin/register',
    active: false,
    disabled: false,
    show: false
  }];
  $scope.onTabSelected = function (tab) {
    $scope.selectedItem = this.$index;
    $materialSidenav('left').close();
    if(tab.title === 'Logout') {
      $scope.logout();
    } else {
      $location.path(tab.link);
    }
  };
  $scope.$on('loggedIn', function (event, reply) {
    $window.localStorage.setItem('user', reply.user);
    $window.localStorage.setItem('admin', reply.admin);
    $scope.username = reply.user;
    $scope.menu[3].show = false;
    $scope.menu[4].show = true;
    $scope.menu[5].show = true;
    $scope.menu[6].show = true;
    if(reply.admin) {
      $scope.menu[7].show = true;
      $scope.menu[8].show = true;
      $scope.menu[9].show = true;
    }
    $location.path('/');
  });
  $rootScope.$on('loggedOut', function () {
    $scope.menu[3].show = true;
    $scope.menu[4].show = false;
    $scope.menu[5].show = false;
    $scope.menu[6].show = false;
    $scope.menu[7].show = false;
    $scope.menu[8].show = false;
    $scope.menu[9].show = false;
    $location.path('/');
  });
  $scope.username = $window.localStorage.getItem('user');
  if($scope.username !== null) {
    $scope.$emit('loggedIn', {user: $scope.username, admin: $window.localStorage.getItem('admin')});
  }
  $scope.logout = function () {
    Userservice.logout().success(function (logoutResp) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 1000,
          message: logoutResp.message
       }
      });
      $window.localStorage.clear();
      $rootScope.$emit('loggedOut');
    }).error(function (error) {
      $materialToast({
        controller: 'ToastCtrl',
        templateUrl: 'components/toast/toast.html',
        position: 'bottom left',
        locals: {
          closeTime: 2000,
          message: error.message
       }
      });
    });
  };
}]);
