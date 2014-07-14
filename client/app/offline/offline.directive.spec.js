'use strict';

describe('Directive: offline', function () {

  // load the directive's module
  beforeEach(module('linesPerBeatApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<offline></offline>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the offline directive');
  }));
});