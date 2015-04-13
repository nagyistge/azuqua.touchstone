var stream = require('stream');
var syntaxCheck = require('./testing_framework/syntax');
var channel = JSON.stringify(require('./channels/marketo.json'));

syntaxCheck(channel, true);
