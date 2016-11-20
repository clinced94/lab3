var net = require('net');

var HOST = 'localhost';
var PORT = 8000;

var socket = new net.Socket();
socket.connect(PORT, HOST, function() {

	console.log('Connection Successful \n' + 'Connected to: ' + HOST + ':' + PORT + '\n');

	socket.write("KILL_SERVICE" + "\n");

});

socket.on('data', function(data) {

	console.log('' + data + '\n');

});

socket.on('close', function() {
	console.log('Connection closed');
});
