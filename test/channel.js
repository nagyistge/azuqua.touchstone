var should = require('chai').should(),
    assert = require('chai').assert;

var method_has_properties = require('./method');
var auth = require('./auth');

module.exports = function(channel, isExternal) {
  describe("Properties of each channel", function() {
    it(channel.name+"'s basic properties", function(done) {
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

      done();
    });

    describe(channel.name+" Auth", function(){
      auth(channel);
    });

    // Run a similar check on methods
    describe("Each method of "+channel.name, function(){
      channel.methods.forEach(function(method){
        method_has_properties(method, channel, isExternal);
      });
    });

  });
};
