'use strict';

describe('Controller: EditprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('linesPerBeatApp'));

  var EditprofileCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditprofileCtrl = $controller('EditprofileCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
