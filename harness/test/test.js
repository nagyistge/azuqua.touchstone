describe("the brick harness", function() {
  var brick = {
    "brick": "http",
    "config": {
      "url": "http://www.google.com",
      "method": "GET"
    }
  };

  it("runs a brick", function(done){
    run(brick, function(err, data){
      if (err) { throw err; }
    });
    done();
  });

});
