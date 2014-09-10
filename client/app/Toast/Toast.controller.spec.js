'use strict';

describe('Controller: ToastCtrl', function () {

  // load the controller's module
  beforeEach(module('linesperbeatApp'));

  var ToastCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ToastCtrl = $controller('ToastCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
