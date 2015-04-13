/*jshint immed:false*/
/*global describe, xdescribe, it, xit, before, after*/
"use strict";
var zebricks = require("zebricks").bricks;

require("chai").should();

var fs = require("fs");
var t = require("../interpret-card");
var extractMethods = require("../extract-methods");
var loadChannel = function(name) {
  return extractMethods(require(name));
};


xdescribe("calling a method", function(){
  it("refuses to call a method that doesn't exist", function(done){
    var method = "fakeMethod",
        trigger = {},
        sinceObject = {};

    t.callMethod(method,trigger,sinceObject, function(err, data){
      (function(){throw err;})
        .should.throw(Error);
      done();
    });
  });
});

describe("executing a card", function(){
  before(function(){
    // Fake a 'custom' dir for now
    // aahhahhaha this is awful
    fs.writeFileSync("../custom.js",
      "var createData = function(options, callback) { callback(null, 'HELLO THIS IS DATA'); }; module.exports.createData = createData; var log = function(options, callback) { console.log(options); callback(null, options.prevData); }; module.exports.log = log;"
    );
  });

  after(function(){
    fs.unlinkSync("../custom.js");
  });

  it("execCard returns data from a brick", function(done){
    var card = t.createCard({}, {}, {}, "zendesk", loadChannel("../data/minizendesk.json")),
        trigger = {"_operation": "testEvent"},
        since = {"since": new Date()};
    t.execCard.call(card, trigger, since, function(err, context, output, since){
      if (err) { throw err; }
      output.should.equal("HELLO THIS IS DATA");
      done();
    });
  });

  it("execCard keeps context (auth, dirname, monitor, floData)", function(done){
    var card = t.createCard({}, {}, {}, "zendesk", loadChannel("../data/minizendesk")),
        trigger = {"_operation": "testEvent"},
        now = new Date(),
        since = {"since": now},
        expectedContext = { "auth":{},"monitor":{},"floData":{},"dirname":"/Users/Lito/_Work/_Azuqua/shinkansen/engine","channelName":"zendesk","methodsRef":{"testEvent":[{"brick":"custom","config":{"method":"createData"}}],"endUserContactUpdate":[{"brick":"http","config":{"method":"GET","url":"http://fake.azuqua.com/users/1"}}],"create":[{"brick":"http","config":{"method":"POST","url":"http://fake.azuqua.com/users/1","body":"HELLO THIS IS DATA"}}]}};

    t.execCard.call(card, trigger, since, function(err, context, output, since){
      // Stringified because that discards instance methods, which otherwise
      // would ruin the comparison
      if (err) { throw err; }
      JSON.stringify(context).should.deep.equal(JSON.stringify(expectedContext));
      since.should.deep.equal({"since": now });
      output.should.equal("HELLO THIS IS DATA");
      done();
    });
  });

  xit("exposes the interface the engine expects", function(done){
    //exports[methodName] = function(trigger, sinceObject, callback)
    done();
  });
});
