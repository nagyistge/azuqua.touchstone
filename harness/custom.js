var createData = function(options, callback) {
  console.log(options);
  callback(null, "HELLO THIS IS DATA");
};
module.exports.createData = createData;

var log = function(options, callback) {
  console.log(options);
  callback(null, options.prevData);
};
module.exports.log = log;
