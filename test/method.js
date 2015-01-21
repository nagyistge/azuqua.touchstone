var should = require('chai').should(),
    assert = require('chai').assert;

var zebrick_has_properties = require('./zebrick'),
    input_has_properties = require('./input'),
    output_has_properties = require('./output'),
    params_has_properties = require('./params');

module.exports = function(method) {
  describe(method.name, function() {
    it("has basic properties", function(){
      assert(method.name !== undefined, "name");
      assert(method.description !== undefined, "description");
      assert(method.kind !== undefined, "kind");
      assert(method.zebricks !== undefined, "zebricks");
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

    if (method.output) {
      describe("params", function(){
        params_has_properties(method);
      });
    }

    // Test a method's zebricks
    if (!Array.isArray(method.zebricks)) {
      describe("object-style zebrick"+method.name, function(){
        it("has webhook properties", function() {
          assert(method.zebricks.start !== undefined, "webhooks start");
          assert(method.zebricks.start !== undefined, "webhooks stop");
        });
      });

    } else {
      describe("Each zebrick of "+method.name, function(){
        method.zebricks.forEach(function(zebrick){
          zebrick_has_properties(zebrick);
        });
      });
    }
  });

};
