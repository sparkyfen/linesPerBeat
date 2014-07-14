'use strict';

describe('Controller: AdminMainCtrl', function () {

  // load the controller's module
  beforeEach(module('linesPerBeatApp'));

  var AdminMainCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AdminMainCtrl = $controller('AdminMainCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
