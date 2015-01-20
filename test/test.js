var async = require('async'),
    fs = require('fs');

var channel_has_properties = require('./channel');
chpath = "/Users/azu-lito/_Azuqua/modules/channel_json/zendesk.json";
channel = JSON.parse(fs.readFileSync(chpath));
channel_has_properties(channel);


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
