var should = require('chai').should(),
    assert = require('chai').assert;

var zebrick_has_properties = require('./zebrick'),
    input_has_properties = require('./input'),
    output_has_properties = require('./output'),
    params_has_properties = require('./params');

module.exports = function(method, channel, isInternal) {
  describe(method.name, function() {
    it("has basic properties", function(done){
      assert(method.name !== undefined, "name");
      assert(method.description !== undefined, "description");
      assert(method.kind !== undefined, "kind");
      assert(method.zebricks !== undefined, "zebricks");
      done();
    });

    if (method.input) {
      describe("input", function(){
        input_has_properties(method);
      });
    }
    if (method.output) {
      describe("output", function(){
        output_has_properties(method);
      });
    }

    if (method.params) {
      describe("params", function(){
        params_has_properties(method, channel);
      });
    }

    // Test a method's zebricks
    if (!Array.isArray(method.zebricks)) {
      describe("object-style zebrick"+method.name, function(){
        it("has webhook properties", function(done) {
          assert(method.zebricks.start !== undefined, "webhooks start");
          assert(method.zebricks.start !== undefined, "webhooks stop");
          done();
        });
      });

    } else {
      describe("Each zebrick of "+method.name, function(){
        method.zebricks.forEach(function(zebrick){
          zebrick_has_properties(zebrick, isInternal);
        });
      });
    }
  });

};
