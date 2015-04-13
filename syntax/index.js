var channel_has_properties = require('./test/channel');

module.exports = function(channelText, isExternal){
  var channel = JSON.parse(channelText);
  channel_has_properties(channel, isExternal);
};
