'use strict';

describe('Controller: GetgruntfileCtrl', function () {

  // load the controller's module
  beforeEach(module('linesPerBeatApp'));

  var GetgruntfileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GetgruntfileCtrl = $controller('GetgruntfileCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
