var authTests = require('./auth_tests'),
    HashSet = require('../lib/HashSet');

module.exports = function(channelJson){
  authTests.verifyUsedProperties(channelJson);
  authTests.verifyRequiredProperties(channelJson);
};
