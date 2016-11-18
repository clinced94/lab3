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

		var splitmsgData = splitMessageData(data);

		if(splitmsgdata.includes("JOIN_CHATROOM:")) {

			console.log(splitmsgData);

			clients.push(socket);

			socket.write("Joined chatroom: " + splitmsgData[0].split(':')[1] + 
				"\nSERVER_IP: " + ADDRESS + 
				"\nPORT: " + PORT + 
				"\nROOM_REF: " + "1" + 
				"\nJOIN_ID: " + "123 " + "\n");

			clients.forEach(socket => socket.write(
				"\nCLIENT_NAME" + splitmsgData[3].split(':')[1] + " has joined the chatroom"));

		}
		else if(splitmsgdata.includes("MESSAGE:")) {
			
			console.log(splitmsgData);
			clients.forEach(socket => socket.write(splitmsgdata[0] + '\n' + 
				splitmsgdata[2] + '\n' + splitmsgdata[3] + '\n\n'));
		}
		else if(splitmsgdata.includes('LEAVE_CHATROOM:')) {

			clients.forEach(socket => socket.write('LEFT_CHATROOM: ' + 
				splitmsgData[0].split(':')[1] + '\nJOIN_ID: ' + 
				splitmsgData[1].split(':')[1]) + '\n');
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
