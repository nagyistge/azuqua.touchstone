"use strict";

var action = {
  auth: {
    type: 'custom',
    marketo_endpoint: 'https://149-ZXA-775.mktorest.com',
    client_id: '8d5dcec7-af8e-4068-abc1-5341ebc81982',
    client_secret: '3WFeZzU2NPZGpJ6GjB9aMX2GAtFQ4DAr',
    configId: 'f6ac604a-1802-4752-b279-86d456c3c073!00d7b6c7-4bf3-40af-94ed-f6ac535add65'
  },
  config: {
    method: 'log'
  },
  input: {
    key: 'name',
    value: 'id',
    table: 'floconfigurations',
    config: {
      type: 'custom',
      marketo_endpoint: 'https://149-ZXA-775.mktorest.com',
      client_id: '8d5dcec7-af8e-4068-abc1-5341ebc81982',
      client_secret: '3WFeZzU2NPZGpJ6GjB9aMX2GAtFQ4DAr',
      configId: 'f6ac604a-1802-4752-b279-86d456c3c073!00d7b6c7-4bf3-40af-94ed-f6ac535add65' },
      trigger: {}
  },
    prevData: [],
    allData: [ {
      access_token: '5b047b65-3fab-4801-9274-0fc1f24a2f07:ab',
      token_type: 'bearer',
      expires_in: 1752,
      scope: 'lito@azuqua.com' },
    {
      requestId: '297c#14c0b2bfaef',
      result: [Object],
      success: true },
    ],
    params: {
    },
    floData: {
      flo: 'metadata',
      org: 'azuqua',
      exec: 4245,
      startedOn: 1426116586581 },
    incomingData: undefined };



// TODO(Lito): Legacy code from zebricks- refactor!
var async = require('async'),
    zebricks = require('zebricks').bricks,
    zebrickData = require('./brickdata.json'),
    slice = Array.prototype.slice;

/* Some things to note:
 * Bracket notation is used in several places to ensure the user can't break 
 * the system with bad var names...it should be sanitized anyway though
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

function onBrickFinish(methodName, brickIndex, brickName, allData, sinceObject) {
  var otherArgs = slice.call(arguments, 5),
      next = otherArgs.pop(), // next = callback to run the next brick in the waterfall
      storeData = otherArgs[0]; // Any data passed from the brick that we just ran and want to store

  allData[brickIndex] = storeData;
  if (otherArgs.length > 1) sinceObject.since = otherArgs[1]; // Was the since changed? If not, put it back to the last one.

  if (this.signal) {
    checkin.call(this, storeData, methodName, brickIndex, brickName);
  }
  next(null);
}

for (var methodName in methods) {
  exports[methodName] = function(trigger, sinceObject, callback) {
    var self = this,
        monitorMethod = this.monitor.submethod, // monitorMethod is something like 'stop' and methodName is the actual name
        methodBricks = zebrickData[methodName] || {},
        brickList = Array.isArray(methodBricks) ? methodBricks : methodBricks[monitorMethod],
        brickSteps = [],
        allData = [];

    if (!Array.isArray(brickList)) return callback(new Error('Method "' + monitorMethod + '" is not supported for operation '+methodName));

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
}
