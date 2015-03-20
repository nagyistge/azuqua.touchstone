"use strict";

var TRACE_PREFIX = 'Channel.listen: ';

//Our top-level variables
var path = require('path'),
    async = require('async'),
    MainAdapter = require('./Methods'),
    flo = require('common').flo;

function Channel(auth, monitor, floData) {
  this.auth = auth || {};
  this.monitor = monitor || {};
  this.floData = floData;
  this.dirname = path.resolve(__dirname); //TODO
}

function floInvokeResponse(err) {
  //if (err) log.error(TRACE_PREFIX + 'flo.invoke: ' + err);
}

Channel.prototype.listen = function(trigger, callback, since) {
  var self = this,
      floData = this.floData,
      sinceObject = { since: since },
      operation = (typeof trigger === 'string') ? trigger : trigger._operation;

  if (!operation) return callback(new Error(TRACE_PREFIX + 'An operation is required'));
  if (!MainAdapter[operation]) return callback(new Error(TRACE_PREFIX + operation + ' is not a valid operation'));

  function onResponse(err, outputs, updatedSinceObject) {
    if (err) return callback(err);

    function afterInvoke(err) {
      callback(err, self, updatedSinceObject.since);
    }

    if (Array.isArray(outputs)) {
      if (!outputs.length) return afterInvoke();

      flo.invoke(floData.org, floData.flo, outputs.shift(), function(err) {
        // If flo.invoke considers an error fatal, don't invoke the rest
        if (err) return afterInvoke(err);

        // This gives the engine a chance to refresh tokens in any/all of 
        // the steps before we send the rest
        // After the first one, invoke the rest in parallel
        async.each(outputs, function(item, fn) {
          flo.invoke(floData.org, floData.flo, item, floInvokeResponse);
          fn(); // Don't wait for a response to invoke the next one
        }, afterInvoke);
      });
    } else if (outputs) {
      flo.invoke(floData.org, floData.flo, outputs, afterInvoke);
    } else afterInvoke();
  }

  if (callback.signal) this.signal = callback.signal;

  MainAdapter[operation].call(this, trigger, sinceObject, onResponse);
};

Channel.prototype.stop = function(stopData, callback) {
  var self = this,
      floData = this.floData,
      sinceObject = { since: since },
      operation = (typeof trigger === 'string') ? trigger : trigger._operation;

  if (!operation) return callback(new Error(TRACE_PREFIX + 'An operation is required'));
  if (!MainAdapter[operation]) return callback(new Error(TRACE_PREFIX + operation + ' is not a valid operation'));

  this.monitor.method = 'stop';

  function onResponse(err, outputs, updatedSinceObject) {
    callback(err, self, updatedSinceObject.since);
  }

  MainAdapter[operation].call(this, trigger, sinceObject, onResponse);
};

module.exports = Channel;
