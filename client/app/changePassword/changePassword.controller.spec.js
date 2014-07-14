'use strict';

describe('Controller: ChangepasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('linesPerBeatApp'));

  var ChangepasswordCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChangepasswordCtrl = $controller('ChangepasswordCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
