var assert = require('chai').assert;
var HashSet = require('../lib/HashSet');

module.exports = function(method){
  it("if there's an output, there's a class", function(){
    assert(method.output.attributes !== undefined, 
      "incomplete output object: missing output.attributes");
    assert(method.output.attributes[0] !== undefined, 
      "output.attributes is empty (just remove output completely)");
  });
};
