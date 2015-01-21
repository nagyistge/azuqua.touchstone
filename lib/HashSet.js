var HashSet = function(list) {
  list = list || [];
  this.EXISTS = {}; // Placeholder value for existance
  this.map = {};
  for (var i = 0; i < list.length; i++) {
    if (typeof(list[i]) !== 'string') {
      throw new TypeError(
        "All elements of a HashSet must be strings. Blame JavaScript."
      );
    }
    this.map[list[i]] = this.EXISTS;
  }
};
// toArray
HashSet.prototype.toArray = function() {
  return Object.keys(this.map);
};

// toArray
HashSet.prototype.toString = function() {
  return this.toArray().toString();
};

HashSet.prototype.isEmpty = function() {
  return Object.keys(this.map).length === 0;
};

// cardinality
HashSet.prototype.cardinality = function() {
  return Object.keys(this.map).length;
};

// insert
HashSet.prototype.insert = function(e) {
  if (typeof(e) !== 'string') {
    throw new TypeError(
      "All elements of a HashSet must be strings. Blame JavaScript."
    );
  }
  this.map[e] = this.EXISTS;
};
// insert

HashSet.prototype.remove = function(e) {
  delete(this.map[e]);
};

// union
HashSet.prototype.union = function(other) {
  var s = new HashSet();
  for (var i in this.map) {
    s.insert(i);
  }
  for (var j in other.map) {
    s.insert(j);
  }
  return s;
};
//isElement
HashSet.prototype.hasElement = function(e) {
  return this.map[e] === this.EXISTS;
};
// subset
// x.subset(y) -> is x a subset of y?
HashSet.prototype.subset = function(other) {
  for (var i in this.map) {
    if(!other.hasElement(i)) {
      return false;
    }
  }
  return true;
};

// intersect
HashSet.prototype.intersect = function(other) {
  var s = new HashSet();
  for (var i in other.map) {
    if (this.hasElement(i)){
      s.insert(i);
    }
  }
  return s;
};

// difference
HashSet.prototype.difference = function(other) {
  var s = new HashSet();
  for (var i in this.map) {
    if (!other.hasElement(i)){
      s.insert(i);
    }
  }
  return s;
};


module.exports = HashSet;
