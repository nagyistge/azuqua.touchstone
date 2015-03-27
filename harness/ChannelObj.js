// Exports two functions:
// createCard(auth, monitor, floData, channelName, channelMethodsReference)
// and
// execCard(trigger, since, callback).
// you MUST call execCard with `execCard.call(card, trigger, since, callback)`
// because zebricks expect a *this* with the properties of `card`
"use strict";
var TRACE_PREFIX = 'Channel.listen: ';

var path = require('path'),
    zebricks = require('zebricks').bricks,
    async = require('async'),
    slice = Array.prototype.slice;

// ! Warning: Legacy code ahead !
function createCard(auth, monitor, floData, channelName, channelMethodsReference) {
  var ret = {
    "auth":  auth || {},
    "monitor":  monitor || {},
    "floData":  floData,
    "dirname": path.resolve(__dirname),
    "channelName": channelName,
    "methodsRef": channelMethodsReference,
  };
  return ret;
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

// Note that all of the *this* references and use of *bind* and *call* 
// are from a distant past when all was object-oriented and bunches of new 
// objects were nonchanantly created for each card execution. As hacky as this 
// currently is, zebricks relies there being certain properties on an 
// object's *this*, so please keep this code intact until we finally make 
// a system-wide change. -L
function onBrickFinish(methodName, brickIndex, brickName, allData, sinceObject) {
  var otherArgs = slice.call(arguments, 5),
      // next = callback to run the next brick in the waterfall
      next = otherArgs.pop(),
      // Any data passed from the brick that we just ran and want to store
      storeData = otherArgs[0];

  allData[brickIndex] = storeData;
  // Was the since changed? If not, put it back to the last one.
  if (otherArgs.length > 1) sinceObject.since = otherArgs[1];

  if (this.signal) checkin.call(this, storeData, methodName, brickIndex, brickName);
  next(null);
}

var callMethod = function(trigger, sinceObject, callback) {
  var methods = this.methodsRef,
      channelName = this.channelName,
      methodName = trigger._operation;

  if (methods[methodName] === undefined) {
    return callback(new Error(channelName+"."+methodName+" is not a valid operation"));
  }

  var self = this,
      // monitorMethod is something like 'stop'; methodName is the actual name
      monitorMethod = this.monitor.submethod,
      methodBricks = methods[methodName] || {},
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

var execCard = function(trigger, since, callback) {
  var self = this,
      floData = this.floData,
      sinceObject = { since: since },
      operation = (typeof trigger === 'string') ? trigger : trigger._operation;

  if (!operation) {
    return callback(
      new Error(this.channelName + 'execCard: an operation is required')
    );
  }

  function onResponse(err, outputs, updatedSinceObject) {
    if (err) return callback(err);

    function afterInvoke(err) {
      callback(err, self, updatedSinceObject.since);
    }

    return callback(err, self, outputs, updatedSinceObject.since);
  }

  if (callback.signal) this.signal = callback.signal;

  callMethod.call(this, trigger, sinceObject, onResponse);
};

module.exports.createCard = createCard;
module.exports.execCard = execCard;
