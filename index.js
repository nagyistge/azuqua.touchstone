var channel_has_properties = require('./test/channel');
var mocha = require('mocha');

module.exports = function(channelText, isExternal){
  var channel = JSON.parse(channelText);
  channel_has_properties(channel, isExternal);
};
