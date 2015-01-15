var should = require('chai').should(),
    assert = require('chai').assert;

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

module.exports = function(zebrick) {
  it("has a recognized brick", function() {
    assert(zebrick.brick !== undefined, "brick DNE");
    assert(valid_brick(zebrick.brick), "found unknown brick "+zebrick.brick);
  });
  it("has a config", function() {
    assert(zebrick.config !== undefined, "config");
    zebrick.config.should.be.an('object');
  });
};
