"use strict";

var assert = require('chai').assert;
var HashSet = require('../lib/HashSet');

function searchParams(zebricksString){
  assert(typeof(zebricksString) === "string", "Argument must be string");
  var regex = /{{params\.[^\{\}]+}}/gi;
  return zebricksString.match(regex).map(
      function(x){
        return x.replace("{{params.", "").replace("}}", "");
      }
    ).filter(
      function(item, pos, self){
        return self.indexOf(item) == pos;
      }
    );
}

function getParams(params) {
  var ret = [];
  params.forEach(function(dict){
    var klass = Object.keys(dict)[0];
    ret.push(klass);
    });
  return ret;
}


module.exports = function(method){
  it("params is non-empty", function(){
    assert(method.params.length !== 0, 
      "params array is empty (just remove params completely)"
    );
  });

  describe("the structure of params",function(){
    method.params.forEach(function(dict){
        var klass = Object.keys(dict)[0];
        it("has basic properties",function(){
            assert(dict[klass].type !== undefined, 
              "params."+klass+"missing type"
          );
            assert(dict[klass].displayname !== undefined, 
              "params."+klass+"missing displayname"
            );
          if (dict[klass].type === "option") {
            assert(dict[klass].choices !== undefined, 
              "option type params."+klass+"missing choices"
            );
          }
        });
        if (dict[klass].lookup !== undefined) {
          it("has metadata", function(){
            assert(dict[klass].lookup.channel !== undefined, 
              "metadata type params."+klass+"missing lookup.channel"
            );
            assert(dict[klass].lookup.key !== undefined, 
              "metadata type params."+klass+"missing lookup.key"
            );
            assert(dict[klass].lookup.value !== undefined, 
              "metadata type params."+klass+"missing lookup.value"
            );
            assert(dict[klass].lookup.operation !== undefined, 
              "metadata type params."+klass+"missing lookup.operation"
            );
          });
        } else {
          it("uses only params it has", function(){
              var used = new HashSet(
                    searchParams(JSON.stringify(method.zebricks))
                  ), 
                  available = new HashSet(getParams(method.params));

              var unavailable = used.difference(available);
              assert(unavailable.isEmpty(), 
                  "found used properties '"+unavailable.toString()+
                  "' that don't exist in 'Params'");
          });
      }
    });
  });
};
