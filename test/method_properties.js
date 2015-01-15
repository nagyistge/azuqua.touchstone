var should = require('chai').should(),
    assert = require('chai').assert;

var zebrick_has_properties = require('./zebrick_properties');

module.exports = function(method) {
  it(method.name+"'s basic properties", function() {
    assert(method.name !== undefined, "name");
    assert(method.description !== undefined, "description");
    assert(method.kind !== undefined, "kind");
    assert(method.zebricks !== undefined, "zebricks");

    if (method.input) {
      method.input.should.be.an('object');
    }
    if (method.output) {
      method.output.should.be.an('object');
    }
    if (method.params) {
      method.params.should.be.an('array');
    }

  });

  if (!Array.isArray(method.zebricks)) {
    assert(method.zebricks.start !== undefined, "webhooks start");
    assert(method.zebricks.start !== undefined, "webhooks stop");
  } else {
    describe("Each zebrick of "+method.name, function(){
      method.zebricks.forEach(function(zebrick){
        zebrick_has_properties(zebrick);
      });
    });
  }
};
