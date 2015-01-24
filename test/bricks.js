var should = require('chai').should(),
    assert = require('chai').assert,
    isSchema = require('schema-is-schema');

var HashSet = require('../lib/HashSet');

module.exports = {
  "http": function(brick, isExternal){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.method !== undefined, "config.method");
      assert(brick.config.url !== undefined, "config.url");
      done();
    });

    it("uses only auth properties it has", function(done){
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
      done();
    });
  },

  "custom": function(brick, isExternal){
    it("is an internal use of a custom brick", function(done){
      if (isExternal){
        throw new Error("'Custom' bricks are not supported in "+
                        "non-Azuqua channels");
      }
      done();
    });

    it("has the required properties (please test on your own!)", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    }); // that's all we can say about custom; config is user-determined
  },

  "atom": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    });
  },

  "collections": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    });

    it("has recognized methods", function(done){
      var collection_methods = ["map", "filterGt", "flatten", "each", "limit"];
      assert(collection_methods.indexOf(brick.config.operation) > -1, 
        "Collection method not recognized");
      done();
    });
  },

  "signal": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    });
  },

  "shapify": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    });
  },

  "massage": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.schema !== undefined, "config.schema");
      done();
    });

    it("schema is a valid JSON-schema", function(done){
      assert(isSchema(brick.config.schema), 
        "config.schema is not a valid JSON schema");
      done();
    });
  },

  "webhook": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      done();
    });
  }
};
