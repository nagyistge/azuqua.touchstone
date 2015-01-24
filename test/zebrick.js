var should = require('chai').should(),
    assert = require('chai').assert;

var bricks = require('./bricks'); 

function valid_brick(brickname) {
  switch (brickname) {
    case "http":
      return true;
    case "massage":
      return true;
    case "custom":
      return true;
    case "atom":
      return true;
    case "collections":
      return true;
    case "signal":
      return true;
    case "shapify":
      return true;
    case "webhook":
      return true;
    default:
      return false;
  }
}

module.exports = function(zebrick, isExternal) {
  it("has a recognized brick", function(done) {
    assert(zebrick.brick !== undefined, "brick DNE");
    assert(valid_brick(zebrick.brick), "found unknown brick "+zebrick.brick);
    done();
  });

  it("has a config", function(done) {
    assert(zebrick.config !== undefined, "config");
    zebrick.config.should.be.an('object');
    done();
  });

  describe("the "+zebrick.brick+" brick", function() {
    bricks[zebrick.brick](zebrick, isExternal);
  });
};
