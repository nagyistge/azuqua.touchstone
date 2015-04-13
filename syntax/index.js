var channel_has_properties = require('./test/channel');

module.exports = function(channelText, isExternal){
  var channel = channelText;
  channel_has_properties(channel, isExternal);
};
