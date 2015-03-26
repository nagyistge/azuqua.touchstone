"use strict";

var TRACE_PREFIX = 'Channel.listen: ';

//Our top-level variables
var path = require('path'),
    async = require('async'),
    MainAdapter = require('./Methods');

function Channel(auth, monitor, floData) {
  this.auth = auth || {};
  this.monitor = monitor || {};
  this.floData = floData;
  this.dirname = path.resolve(__dirname); //TODO
}

function floInvokeResponse(err) {
  //if (err) log.error(TRACE_PREFIX + 'flo.invoke: ' + err);
}

Channel.prototype.listen = function(trigger, since, callback) {
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

  //TODO: Is this right?
  MainAdapter.callMethod.call(this, operation, trigger, sinceObject, onResponse);
};

module.exports = Channel;
