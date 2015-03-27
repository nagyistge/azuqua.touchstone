var zebricks = require('zebricks').bricks,
    nock = require('nock');

require('chai').should();

var C = require('../ChannelObj');
var utils = require('../utils');

function loadChannel(channelName) {
  // works with 'require' now for testing;
  // will be changed to a database call or something later
  return utils.extractMethods(require('./'+channelName+'.json'));
}

describe("converting channel json to a list of methods", function() {

  it("takes a channel JSON file and returns a methods object", function(){
    utils.extractMethods(require('../minizendesk.json')).should.deep.equal(

      {
        "endUserContactUpdate": [
          { "brick": "http",
            "config": {
              "method":"GET",
              "url":"http://fake.azuqua.com/users/1"
        }}],
        "testEvent": [{
            "brick": "custom",
            "config": {
              "method": "createData"
            }
          }],
    "create": [
      {
        "brick": "http",
        "config": {
          "method": "POST",
          "url": "http://fake.azuqua.com/users/1",
          "body": "HELLO THIS IS DATA"
        }
      }]}

    );
  });

});

describe("calling a method", function(){
  it("refuses to call a method that doesn't exist", function(done){
    var method = "fakeMethod",
        trigger = {},
        sinceObject = {};

    utils.callMethod(method,trigger,sinceObject, function(err, data){
      (function(){throw err;})
        .should.throw(Error);
      done();
    });
  });
});

describe("the Channel class", function(){
  it("can be passed in when calling the nop zebrick", function(done){
    var input = ["HELLO THIS IS DATA"],
        card = C.createCard({}, {}, {}),
        clonedConfig = {},
        trigger = {},
        sinceObject = {};

    var callable = zebricks.nop.monitor.bind(card,
                                         clonedConfig,
                                         trigger,
                                         input,
                                         sinceObject);

    callable(function(err, data){
      data.should.equal(input[input.length-1]);
      done();
    });
  });

  it("channel.listen returns data from a brick", function(done){
    var card = C.createCard({}, {}, {}),
        trigger = {"_operation": "testEvent"},
        since = {"since": new Date()};
    C.listen.call(card, trigger, since, function(err, context, output, since){
      if (err) { throw err; }
      output.should.equal("HELLO THIS IS DATA");
      done();
    });
  });

  it("channel.listen keeps context (auth, dirname, monitor, floData)", function(done){
    var card = C.createCard({}, {}, {}),
        trigger = {"_operation": "testEvent"},
        now = new Date(),
        since = {"since": now},
        expectedContext = {
          "auth": {},
          "monitor": {},
          "floData": {},
          "dirname": "/Users/azu-lito/ChannelTesting/testing_framework/harness"
        };
    C.listen.call(card, trigger, since, function(err, context, output, since){
      // Stringified because that discards instance methods, which otherwise
      // would ruin the comparison
      JSON.stringify(context).should.deep.equal(JSON.stringify(expectedContext));
      since.should.deep.equal({"since": now });
      output.should.equal("HELLO THIS IS DATA");
      if (err) { throw err; }
      done();
    });
  });

  it("exposes the interface the engine expects", function(done){
    //exports[methodName] = function(trigger, sinceObject, callback) 
    done();
  });
});
