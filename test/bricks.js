var should = require('chai').should(),
    assert = require('chai').assert,
    isSchema = require('schema-is-schema');

var HashSet = require('../lib/HashSet');

module.exports = {
  "http": function(brick, isInternal){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.method !== undefined, "config.method");
      assert(brick.config.url !== undefined, "config.url");
      done();
    });

    it("uses valid config properties", function(done){
      var available = new HashSet([
        "method",
        "url",
        "auth",
        "query",
        "headers",
        "body"
        ]),
          used = new HashSet(Object.keys(brick.config));

      var unavailable = used.difference(available);
      assert(unavailable.isEmpty(),
        "found used properties "+unavailable.toString()+
        " that don't exist in the http brick");
      done();
    });
  },

  "custom": function(brick, isInternal){
    it("is an internal use of a custom brick", function(done){
      if (!isInternal){
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

  "wrap": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.in !== undefined, "config.in");
      done();
    });
  },

  "scope": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.path !== undefined, "config.path");
      done();
    });
  },

  "dateslice": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.path !== undefined, "config.date");
      assert(brick.config.path !== undefined, "config.path");
      done();
    });
  },

  "shapify": function(brick){
    it("has the required properties", function(done){
      assert(false, "The Shapify brick is deprecated: please use Massage");
      done();
    });
  },

  "since": function(brick){
    it("has the required properties", function(done){
      assert(brick.brick !== undefined, "brick");
      assert(brick.config !== undefined, "config");
      assert(brick.config.format !== undefined, "config.format");
      assert(brick.config.path !== undefined, "config.path");
      assert(brick.config.invalid !== undefined, "config.invalid");
      assert(Array.isArray(brick.config.invalid),
        "config.invalid should be array"
      );
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
