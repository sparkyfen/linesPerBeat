'use strict';

describe('Controller: AddteamCtrl', function () {

  // load the controller's module
  beforeEach(module('linesperbeatApp'));

  var AddteamCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddteamCtrl = $controller('AddteamCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
