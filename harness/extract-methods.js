"use strict";

function toCamelCase(spaceDelimitedString) {
  var camel = spaceDelimitedString
    .split(" ")
    .map(function(s){
      return s[0].toUpperCase() + s.slice(1);
    })
    .join("");
  return camel[0].toLowerCase() + camel.slice(1);
}

function extractMethods(channelJson){
  var ret = {};
  channelJson.methods.forEach(function(method){
    var name = toCamelCase(method.name);
    ret[name] = method.zebricks;
  });
  return ret;
}
module.exports = extractMethods;
