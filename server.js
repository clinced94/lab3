const net = require('net');

const ADDRESS = '10.62.0.46';
//get port number
var PORT;
if(process.argv[2]) {
	PORT = process.argv[2];
}
else {
	console.log("No port entered... using default port 8000");
	PORT = 8000;
}

var clients = [];




var server = net.createServer();

server.on('connection', function(socket) {

	var socketAddress = socket.remoteAddress + ':' + socket.remotePort;
	console.log('Connection established\n' + socketAddress + ' has connected');

	socket.on('data', function(data) {

		if(data.indexOf("JOIN_CHATROOM:") !== -1) {

			var splitmsgData = splitMessageData(data);
			console.log(splitmsgData);

			clients.push(socket);

			socket.write("Joined chatroom: " + splitmsgData[0].split(':')[1] + 
				"\nSERVER_IP: " + ADDRESS + 
				"\nPORT: " + PORT + 
				"\nROOM_REF: " + "1" + 
				"\nJOIN_ID: " + "123 " + "\n");

		}

	});

	socket.on('close', function() {

		console.log('Connection closed with ' + socketAddress);
		server.close();
	});

	socket.on('error', function(err) {

		console.log('An error has occurred. \nDetails: ' + err.message);
	});
});


server.on('close', function() {

	console.log('Server has closed');
});

server.on('error', function(err) {

	console.log('An error has occurred with the server. \nDetails: ' + err.message);
});

server.listen(PORT, ADDRESS, function() {

	console.log('Listening on ' + server.address().address + ':' + PORT);
});



//split message by every new line, return as an array
function splitMessageData(data) {
	var messageData = '';
	messageData += data;
	var messageDataArray = messageData.split('\n');

	return messageDataArray;
}
