var async = require('async'),
    fs = require('fs');

var testFramework = require('../');

var chpath = "/Users/azu-lito/_Azuqua/modules/channel_json/zendesk.json";
var channel = fs.readFileSync(chpath);
testFramework(channel);


/* Test ALL the channels
// Load channels
var PATH = "/Users/azu-lito/_Azuqua/modules/channel_json/";
var channels = [];
fs.readdirSync(PATH).forEach(function(filepath){
  filepath = PATH + filepath;
  var ch = fs.readFileSync(filepath);
  channels.push(JSON.parse(ch));
});

async.each(channels, function(channel){
  channel_has_properties(channel);
});
*/
