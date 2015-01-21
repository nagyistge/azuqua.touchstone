var should = require('chai').should(),
    assert = require('chai').assert;

var HashSet = require('../lib/HashSet');

module.exports = {
  "http": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.method !== undefined, "config.method");
      assert(brick.config.url !== undefined, "config.url");
    });

    it("doesn't have unsupported properties", function(){
      it("uses only auth properties it has", function(){
        var available = new HashSet([
          "sinceFormat",
          "method",
          "url",
          "auth",
          "query",
          "headers",
          "body",
          "scopeResponse",
          "wrapResponse"
          ]), 
            used = new HashSet(Object.keys(brick.config));

        var unavailable = used.difference(available);
        assert(unavailable.isEmpty(), 
          "found used properties "+unavailable.toString()+
          " that don't exist in the http brick");
      });
    });
  },

  "custom": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    }); // that's all we can say about custom; config is user-determined
  },

  "atom": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  },

  "collections": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  },

  "signal": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  },

  "shapify": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  },

  "massage": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  },

  "webhook": function(brick){
    it("has the required properties", function(){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
    });
  }
};
