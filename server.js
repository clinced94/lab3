const net = require('net');
const os = require('os');

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

	socket.on("data", function(dat) {
		if(dat.includes("JOIN_CHATROOM:")) {
			var splitmsgdat = splitMessagedata(dat);
			console.log(splitmsgdata);

			clients.push(socket);

			socket.write("Joined chatroom: " + splitmsgdata[0].split(':')[1] +
				"\nSERVER_IP: " + ADDRESS +
				"\nPORT: " + PORT +
				"\nROOM_REF: " + "1" +
				"\nJOIN_ID: " + "123 " + "\n");

			clients.forEach(function(socket) {
				socket.write("\nCLIENT_NAME" + splitmsgdata[3].split(':')[1] +
					" has joined the chatroom");
			});

		}
		else if(dat.includes("MESSAGE:")) {
			var splitmsgdata = splitMessagedata(dat);
			console.log(splitmsgdat);
			clients.forEach(function(socket) {
				socket.write(splitmsgdata[0] + '\n' +
				splitmsgdata[2] + '\n' + splitmsgdata[3] + '\n\n')
			});
		}
		else if(dat.includes("LEAVE_CHATROOM:")) {
			var splitmsgdata = splitMessagedata(dat);
			clients.forEach(function(socket) {
				socket.write('LEFT_CHATROOM: ' +
				splitmsgdata[0].split(':')[1] + '\nJOIN_ID: ' +
				splitmsgdata[1].split(':')[1]) + '\n';
			});
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
function splitMessagedat(dat) {
	var messagedat = '';
	messagedat += dat;
	var messagedatArray = messagedat.split('\n');

	return messagedatArray;
}
