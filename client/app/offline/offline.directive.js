/* global Offline, $ */
'use strict';

angular.module('linesPerBeatApp')
  .directive('offlineFade', function () {
  return {
    restrict: 'A',
    link: function(scope, element) {
      Offline.on('confirmed-down', function () {
        element.fadeOut('fast', function () {
          $('.offline').fadeIn('fast');
        });
      });
      Offline.on('confirmed-up', function () {
        $('.offline').fadeOut('fast', function () {
          element.fadeIn('fast');
        });
      });
    }
  };
});

angular.module('linesPerBeatApp')
  .directive('offlineDisabled', function () {
  return {
    restrict: 'A',
    link: function(scope, element) {
      Offline.on('confirmed-down', function () {
        element.prop('disabled', true);
      });
      Offline.on('confirmed-up', function () {
        element.prop('disabled', false);
      });
    }
  };
});