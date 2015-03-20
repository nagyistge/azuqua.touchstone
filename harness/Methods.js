"use strict";

var channelName = 'zendesk'; // TODO

var async = require('async'),
    zebricks = require('zebricks').bricks,
    channelJson = require('./'+channelName+'.json'),
    slice = Array.prototype.slice;

/* Some things to note:
 * Bracket notation is used in several places to ensure the user can't break the system with bad var names...it should be sanitized anyway though
 */

function checkin(result, methodName, brickIndex, brickName) {
  this.signal.emit(
    this.signal._channelKey,
    'log',
    {
      brickIndex: brickIndex,
      brickName: brickName,
      method: methodName,
      result: result
    }
  );
}

function getMethods(channelJson){
  // should map the method list to {methodName: bricklist} pairs
}

function onBrickFinish(methodName, brickIndex, brickName, allData, sinceObject) {
  var otherArgs = slice.call(arguments, 5),
      next = otherArgs.pop(), // next = callback to run the next brick in the waterfall
      storeData = otherArgs[0]; // Any data passed from the brick that we just ran and want to store

  allData[brickIndex] = storeData;
  // Was the since changed? If not, put it back to the last one.
  if (otherArgs.length > 1) sinceObject.since = otherArgs[1];

  if (this.signal) checkin.call(this, storeData, methodName, brickIndex, brickName);
  next(null);
}


/**
 * End User Contact Update: Monitor for changing contact information
 * kind: event
 */
channelJson.methods.forEach(function(methodName){
  exports[methodName] = function(trigger, sinceObject, callback) {
    var self = this,
        monitorMethod = this.monitor.submethod, // monitorMethod is something like 'stop' and methodName is the actual name
        methodBricks = getMethods(channelJson)[methodName] || {},
        brickList = Array.isArray(methodBricks) ? methodBricks : methodBricks[monitorMethod],
        brickSteps = [],
        allData = [];

    if (!Array.isArray(brickList)) return callback(new Error('Method "' + monitorMethod + '" is not supported for operation'+methodName));

    function makeBrickSteps(brickConfig, i) {
      var brickName = brickConfig.brick,
          brickModule = zebricks[brickName],
          clonedConfig = JSON.parse(JSON.stringify(brickConfig.config));

      brickSteps.push((brickModule[monitorMethod] || brickModule.monitor).bind(self, clonedConfig, trigger, allData, sinceObject));
      brickSteps.push(onBrickFinish.bind(self, methodName, i, brickName, allData, sinceObject));
    }

    brickList.forEach(makeBrickSteps);
    async.waterfall(brickSteps, function(err) {
      callback(err, allData[allData.length - 1],sinceObject); });
  };

});
