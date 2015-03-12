channel = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', function(buf) {
  channel += buf;
});
process.stdin.on('end', function() {
  test(channel, true);
});
