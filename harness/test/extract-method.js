/*jshint immed:false*/
/*global describe, it*/
"use strict";
var t = require("../extract-methods");
describe("converting channel json to a list of methods", function() {

  it("takes a channel JSON file and returns a methods object", function(){
    t(require("../data/minizendesk.json")).should.deep.equal(

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
