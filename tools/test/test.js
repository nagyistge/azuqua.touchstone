// This is getting kind of meta
// I am testing my tests

var async = require('async'),
    fs = require('fs'), 
    should = require('chai').should();

var t = require('../verifyAuthProperties');

var chpath = "/Users/azu-lito/_Azuqua/modules/channel_json/zendesk.json";
var channelString = fs.readFileSync(chpath, 'utf8');
var channel = JSON.parse(channelString);

describe("verifying auth", function (){
  describe("matching auth params", function (){
    it("finds all auth params in the text", function(){
      var results = t.searchAuthProperties(channelString);
      // console.log(results);
      results.should.deep.equal(["subdomain", "username", "password"]);
    });

    it("finds all auth properties in the auth block", function(){
      var results = t.expectedProperties(channel.auth);
      results.should.deep.equal(["subdomain", "username", "password"]);
    });
  });
});
