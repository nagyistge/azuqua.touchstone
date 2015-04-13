var stream = require('stream');
var syntaxCheck = require('./syntax');
var channel = require('../channels/marketo.json');

syntaxCheck(channel, true);
