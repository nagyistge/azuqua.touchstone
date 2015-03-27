function loadChannel(channelName) {
  // works with 'require' now for testing;
  // will be changed to a database call or something later
  return utils.extractMethods(require('./'+channelName+'.json'));
}

new Card({}, {}, {}, loadChannel('minizendesk'));
