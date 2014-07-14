'use strict';

describe('Controller: LinklastfmCtrl', function () {

  // load the controller's module
  beforeEach(module('linesPerBeatApp'));

  var LinklastfmCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LinklastfmCtrl = $controller('LinklastfmCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
