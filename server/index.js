var app = require('./app').app,
	db = require('./db'),
	httpServer = require('./app').server;

var port = 8080;
var server = httpServer.listen(process.env.PORT || port, function () {
	console.log('HTTP server patiently listening on port', port);
});

module.exports = httpServer;
