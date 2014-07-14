'use strict';

describe('Service: Adminservice', function () {

  // load the service's module
  beforeEach(module('linesPerBeatApp'));

  // instantiate service
  var Adminservice;
  beforeEach(inject(function (_Adminservice_) {
    Adminservice = _Adminservice_;
  }));

  it('should do something', function () {
    expect(!!Adminservice).toBe(true);
  });

});
