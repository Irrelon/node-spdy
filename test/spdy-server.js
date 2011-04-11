var fs = require('fs'),
    http = require('http'),
    spdy = require('../lib/spdy'),
    tls = require('tls'),
    buffer = require('buffer').Buffer,
    NPNProtocols = new Buffer(7);

if (!tls.hasNPN) throw 'You\'re using not NPN-enabled version of node.js';

NPNProtocols[0] = 6;
NPNProtocols.write('spdy/2', 1);

var options = {
  key: fs.readFileSync(__dirname + '/../keys/spdy-key.pem'),
  cert: fs.readFileSync(__dirname + '/../keys/spdy-cert.pem'),
  ca: fs.readFileSync(__dirname + '/../keys/spdy-csr.pem'),
  NPNProtocols: NPNProtocols
};

var static = require('connect').static(__dirname + '/../pub');

spdy.createServer(options, function(req, res) {
  static(req, res, function() { 
    res.writeHead(404);
    res.end();
  });
}).listen(8081, function() {
  console.log('TLS NPN Server is running on port : %d', 8081);
});
