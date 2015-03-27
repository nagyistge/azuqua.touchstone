"use strict";

var channelName = 'minizendesk'; // TODO

var async = require('async'),
    zebricks = require('zebricks').bricks,
    channelJson = require('./'+channelName+'.json'),
    slice = Array.prototype.slice;

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

function toCamelCase(spaceDelimitedString){
  var camel = spaceDelimitedString
    .split(" ")
    .map(function(s){
      return s[0].toUpperCase() + s.slice(1);
    })
    .join("");
  return camel[0].toLowerCase() + camel.slice(1);
}
exports.toCamelCase = toCamelCase;

function extractMethods(channelJson){
  // Moves
  var ret = {};
  channelJson.methods.forEach(function(method){
    var name = toCamelCase(method.name);
    ret[name] = method.zebricks;
  });
  return ret;
}
exports.extractMethods = extractMethods;

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
var callMethod = function(methodName, trigger, sinceObject, callback) {
  var extractedMethods = extractMethods(channelJson);

  if (extractedMethods[methodName] === undefined) {
    return callback(new Error(channelName+"."+methodName+" is not a valid operation"));
  }

  var self = this,
      // monitorMethod is something like 'stop'; methodName is the actual name
      monitorMethod = this.monitor.submethod,
      methodBricks = extractedMethods[methodName] || {},
      brickList = Array.isArray(methodBricks) ? methodBricks : methodBricks[monitorMethod],
      brickSteps = [],
      allData = [];

  if (!Array.isArray(brickList)) return callback(new Error('Method "' + monitorMethod + '" is not supported for operation '+methodName));

  function makeBrickSteps(brickConfig, i) {
    var brickName = brickConfig.brick,
        brickModule = zebricks[brickName],
        clonedConfig = JSON.parse(JSON.stringify(brickConfig.config));

    brickSteps.push((brickModule[monitorMethod] || brickModule.monitor)
      .bind(self, clonedConfig, trigger, allData, sinceObject));

    brickSteps.push(onBrickFinish.bind(self, methodName, i, brickName, allData, sinceObject));
  }

  brickList.forEach(makeBrickSteps);
  async.waterfall(brickSteps, function(err) {
    callback(err, allData[allData.length - 1],sinceObject); });
};
exports.callMethod = callMethod;
