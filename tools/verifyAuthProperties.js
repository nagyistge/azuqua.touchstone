// look up all of the properties of auth accessed
// expose them to the user at test-time
// verify that they all exist in auth
assert = require('chai').assert;

searchAuthProperties = function(channelString){
  assert(typeof(channelString) === "string", "Argument must be string");
  var regex = /{{auth\.[^\{\}]+}}/gi;
  return channelString.match(regex).map(
      function(x){
        return x.replace("{{auth.", "").replace("}}", "");
      }
    ).filter(
      function(item, pos, self){ // TODO(Lito): Quadratic time, do we need a speedup?
        return self.indexOf(item) == pos;
      }
    );
};

expectedProperties = function(auth){
  switch (auth.type){
    case "oauth":
      if (auth.version === "2.0"){
        return [
          "client_id", 
          "client_secret", 
          "base_site", 
          "authorize_path", 
          "access_token_path",
          auth.access_token_name,
          "consumer_key", 
          "consumer_secret", 
          "refresh_path", 
          "hostname", 
          "redirect_uri"];
      } else {
        return [ 
          "consumer_key", 
          "consumer_secret", 
          "request_url", 
          "access_url", 
          "redirect", 
          "callback", 
          "signature_method", 
          "nonce_size"];
      }
      break;

    case "basic":
      return Object.keys(auth.authparams);

    case "custom":
      return Object.keys(auth.authparams);
  }
};

module.exports.verifyAuth = function(channelJson) {
  it("has expected auth properties", function(){
    var used = new HashSet(searchAuthProperties), 
        available = new HashSet(expectedProperties);

    var unavailable = used.subtract(available);
    assert(unavailable.empty, 
      "found used properties "+unavailable.toString+
      "that don't exist in 'Auth'");
  });
};

module.exports.expectedProperties = expectedProperties;
module.exports.searchAuthProperties = searchAuthProperties;
