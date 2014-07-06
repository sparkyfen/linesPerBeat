'use strict';

// This is a work around for elements that have their values populated by ng-model and the view for the input is as if there is no value.
// TODO Need to finish getting this material focus directive working.
angular.module('linesPerBeatApp').directive('materialFocus', [function(){
  return {
    restrict: 'A',
    link: function($scope, element) {
      element.addClass('material-input-focused');
      element.removeClass('material-input-focused');
      var e = angular.element.Event('keyup');
      element.trigger(e);
    }
  };
}]);