var net = require('net');

var HOST = 'localhost';
var PORT = 8000;

var socket = new net.Socket();
socket.connect(PORT, HOST, function() {

	console.log('Connection Successful \n' + 'Connected to: ' + HOST + ':' + PORT + '\n');

	socket.write("JOIN_CHATROOM:1\n" +
        "CLIENT_IP:135.444.0.7\n" +
        "PORT:8000\n" +
        "CLIENT_NAME:BroBiden\n\n");


    socket.write("LEAVE_CHATROOM:1\n" +
        "JOIN_ID:123\n" +
        "CLIENT_NAME:BroBiden\n\n");

  });

  socket.on('data', function(data) {

  	console.log('' + data + '\n');

  });

  socket.on('close', function() {
  	console.log('Connection closed');
  });
