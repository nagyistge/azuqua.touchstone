"use strict";

/**
 * {{name}}
 * {{description}}
 * author: {{author}}
 * version: {{version}}
*/

//Our constants
var TRACE_PREFIX = '{{constructorName}}.execute: ';

//Our top-level variables
var MainAdapter = require('./adapter');

module.exports = {
  execute: function (operation, instanceJson, stepJson, callback) {
    var stepData = JSON.parse(stepJson),
        adapter = MainAdapter.Adapter(stepData);

    if (!operation) return callback(new Error(TRACE_PREFIX + 'An operation is required'));
    if (!adapter[operation]) return callback(new Error(TRACE_PREFIX + operation + ' is not a valid operation'));

    function onResponse(err, outputs) {
      if (err) {
        log.error(TRACE_PREFIX + 'operation failed: ' + err);
        return callback(err);
      }

      callback(null, JSON.stringify(outputs || {}));
    }

    adapter[operation](stepData, onResponse);
  }
};
