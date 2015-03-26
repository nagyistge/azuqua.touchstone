var zebricks = require('zebricks').bricks,
    nock = require('nock');

require('chai').should();

var M = require('../Methods');
var C = require('../ChannelObj');

describe("converting channel json to a list of methods", function() {

  it("takes a channel JSON file and returns a methods object", function(){
    M.extractMethods(require('../minizendesk.json')).should.deep.equal(

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
          }, {
            "brick": "custom",
            "config": {
              "method": "log"
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

    M.callMethod(method,trigger,sinceObject, function(err, data){
      (function(){throw err;})
        .should.throw(Error);
      done();
    });
  });
});

describe("the Channel class", function(){
  it("can call the nop zebrick", function(done){
    var input = ["HELLO THIS IS DATA"],
        newChannel = new C(),
        clonedConfig = {},
        trigger = {},
        sinceObject = {};

    var callable = zebricks.nop.monitor.bind(newChannel,
                                         clonedConfig,
                                         trigger,
                                         input,
                                         sinceObject);

    callable(function(err, data){
      data.should.equal(input[input.length-1]);
      done();
    });
  });

  it("monitor.listen returns data from a brick", function(done){
    var newChannel = new C(),
        trigger = {"_operation": "testEvent"},
        since = {"since": new Date()};
    newChannel.listen(trigger, since, function(err, self, output, since){
      if (err) { throw err; }
      output.should.equal("HELLO THIS IS DATA");
      done();
    });
  });

  it("monitor.listen keeps context (auth, dirname, monitor, floData)", function(done){
    var newChannel = new C(),
        trigger = {"_operation": "testEvent"},
        since = {"since": new Date()};
    newChannel.listen(trigger, since, function(err, self, output, since){
      if (err) { throw err; }
      console.log(self, output, since);
      output.should.equal("HELLO THIS IS DATA");
      done();
    });
  });

  it("exposes the interface the engine expects", function(done){
    //exports[methodName] = function(trigger, sinceObject, callback) 
    done();
  });
});
