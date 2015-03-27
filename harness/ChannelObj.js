"use strict";

var TRACE_PREFIX = 'Channel.listen: ';

var channelName = 'minizendesk'; // TODO: parameterize

//Our top-level variables
var path = require('path'),
    zebricks = require('zebricks').bricks,
    async = require('async'),
    channelJson = require('./'+channelName+'.json'),
    utils = require('./utils'),
    slice = Array.prototype.slice;

function createCard(auth, monitor, floData) {
  var ret = {
    "auth":  auth || {},
    "monitor":  monitor || {},
    "floData":  floData,
    "dirname": path.resolve(__dirname)// TODO
  };
  return ret;
}
module.exports.createCard = createCard;

function floInvokeResponse(err) {
  //if (err) log.error(TRACE_PREFIX + 'flo.invoke: ' + err);
}

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
  var extractedMethods = utils.extractMethods(channelJson);

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

var listen = function(trigger, since, callback) {
  var self = this,
      floData = this.floData,
      sinceObject = { since: since },
      operation = (typeof trigger === 'string') ? trigger : trigger._operation;

  if (!operation) return callback(new Error(TRACE_PREFIX + 'An operation is required'));

  function onResponse(err, outputs, updatedSinceObject) {
    if (err) return callback(err);

    function afterInvoke(err) {
      callback(err, self, updatedSinceObject.since);
    }

    return callback(err, self, outputs, updatedSinceObject.since);
  }

  if (callback.signal) this.signal = callback.signal;

  callMethod.call(this, operation, trigger, sinceObject, onResponse);
};
module.exports.listen = listen;
