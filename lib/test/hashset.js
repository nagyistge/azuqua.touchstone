var should = require('chai').should();

var HashSet = require('../HashSet');

describe("HashSet data structure", function() {
  it("can be constructed from a list", function() {
    var h = new HashSet(["1", "2", "3"]);
    Object.keys(h.map).should.deep.equal(["1", "2", "3"]);
  });

  it("can be constructed empty", function() {
    var h = new HashSet();
    Object.keys(h.map).should.deep.equal([]);
  });

  it("won't accept non-string params", function() {
    (function() {
      var h = new HashSet([{}, [], 3]);
    }).should.throw(TypeError);
  });

  it("can be converted to a string", function() {
    var h = new HashSet(["a", "b"]).toString();
    h.should.equal("a,b");
  });

  it("has cardinality", function() {
    var h = new HashSet(["a", "b", "c"]);
    h.cardinality().should.equal(3);
  });

  it("supports insertions", function() {
    var h = new HashSet(["a", "b", "c"]);
    h.insert("r");
    h.toArray().should.deep.equal(["a", "b", "c", "r"]);
  });

  it("will only insert strings", function() {
    (function(){
      var h = new HashSet(["a", "b", "c"]);
      h.insert(1);
    }).should.throw(TypeError);
  });

  it("supports removing", function() {
    var h = new HashSet(["a", "b", "c"]);
    h.remove("a");
    h.toArray().should.deep.equal(["b", "c"]);
  });

  it("has empty check", function() {
    var h = new HashSet();
    h.isEmpty().should.equal(true);
  });

  it("supports unions", function() {
    var h = new HashSet(["a", "b", "c"]);
    var g = new HashSet(["x", "y", "z"]);
    var u = h.union(g);
    u.toArray().should.deep.equal(["a", "b", "c", "x", "y", "z"]);
  });

  it("supports intersections that result in nothing", function() {
    var h = new HashSet(["a", "b", "c"]);
    var g = new HashSet(["x", "y", "z"]);
    var u = h.intersect(g);
    u.toArray().should.deep.equal([]);
  });

  it("supports intersections", function() {
    var h = new HashSet(["a", "b", "c"]);
    var g = new HashSet(["a", "f", "b"]);
    var u = h.intersect(g);
    u.toArray().should.deep.equal(["a", "b"]);
  });

  it("supports differences", function() {
    var h = new HashSet(["a", "b", "c"]);
    var g = new HashSet(["a", "f", "b"]);
    var u = h.difference(g);
    u.toArray().should.deep.equal(["c"]);
  });

  it("supports subset", function() {
    var h = new HashSet(["a", "b", "c"]);
    var g = new HashSet(["a", "f", "b"]);
    h.subset(g).should.equal(false);

    h = new HashSet(["a"]);
    g = new HashSet(["a", "f", "b"]);
    h.subset(g).should.equal(true);
  });
});
