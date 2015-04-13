var stream = require('stream');
var syntaxCheck = require('./syntax');
var channel = JSON.stringify(require('../channels/marketo.json'));

syntaxCheck(channel, true);
