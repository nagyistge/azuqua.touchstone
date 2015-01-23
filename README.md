Touchstone
==========

External channel testing framework

`mocha` to run all tests.

Use
---

    var touchstone = require('touchstone');

    var channel = JSON.parse(fs.readFileSync(./mychannel.json));

    // if the second arg (`isExternal`) is true, touchstone will refuse 
    // to accept channels with custom code.
    var isExternal = true; 

    touchstone(channel, isExternal)
