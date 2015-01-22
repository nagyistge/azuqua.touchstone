var assert = require('chai').assert;
var HashSet = require('../lib/HashSet');

function searchInput(zebricksString){
  assert(typeof(zebricksString) === "string", "Argument must be string");
  var regex = /{{input\.[^\{\}]+}}/gi;
  return zebricksString.match(regex).map(
      function(x){
        return x.replace("{{input.", "").replace("}}", "");
      }
    ).filter(
      function(item, pos, self){ // again, quadratic time complexity
        return self.indexOf(item) == pos;
      }
    );
}
function getInputs(input) {
  var ret = [];
  input.attributes.forEach(function(klass){
    klass.attributes.forEach(function(attr){
      ret.push(klass.name+"."+attr.name);
    });
  });

  return ret;
}

module.exports = function(method){
  it("if there's an input, there's a class", function(){
    assert(method.input.attributes !== undefined, 
      "incomplete input object: missing input.attributes");
    assert(method.input.attributes[0] !== undefined, 
      "input.attributes is empty (just remove input completely)");
  });

  // Metadata handles everything differently

  if (method.input.attributes[0].attributes[0].metadata !== undefined){
    it("has metadata (not available for testing)", function(){
    });
  } else {
    it("uses only input properties it has", function(){
      var used = new HashSet(searchInput(JSON.stringify(method.zebricks))), 
          available = new HashSet(getInputs(method.input));

      var unavailable = used.difference(available);
      assert(unavailable.isEmpty(), 
        "found used properties '"+unavailable.toString()+
        "' that don't exist in 'Input'");
    });
  }
};
