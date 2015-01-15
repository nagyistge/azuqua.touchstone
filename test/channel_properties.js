var should = require('chai').should(),
    assert = require('chai').assert;

var method_has_properties = require('./method_properties');

module.exports = function(channel) {
  describe("Properties each channel should have", function(){
    it(channel.name+"'s basic properties", function() {
      assert(channel.name !== undefined, "name");
      assert(channel.description !== undefined, "description");
      assert(channel.version !== undefined, "version");
      assert(channel.creator !== undefined, "creator");
      channel.creator.should.be.an('object');
      assert(channel.type !== undefined, "type");
      assert(channel.auth !== undefined, "auth");
      channel.auth.should.be.an('object');
      assert(channel.recurrence !== undefined, "recurrence");
      assert(channel.dependencies !== undefined, "dependencies");
      channel.dependencies.should.be.an('object');
      assert(channel.methods !== undefined, "methods");
      channel.methods.should.be.an('array');

    });

    // Run a similar check on methods
    describe("Each method of "+channel.name+" should have", function(){
      channel.methods.forEach(function(method){
        method_has_properties(method);
      });
    });
  });
};
