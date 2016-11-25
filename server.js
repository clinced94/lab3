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


//TODO: implement chatrooms
var chatrooms = {};

var clients = [];
var join_id = 0;



var server = net.createServer();

server.on('connection', function(socket) {

	var socketAddress = socket.remoteAddress + ':' + socket.remotePort;
	console.log('Connection established\n' + socketAddress + ' has connected');

	socket.on("data", function(dat) {

		var splitData = splitMessagedata(dat);

			if(splitData[0].includes("JOIN_CHATROOM:")) {

				var roomRef = splitData[0].split(':')[1];
				join_id ++;
				if(!chatrooms.hasOwnProperty(roomRef)) {
					chatrooms[roomRef] = [];
					console.log("chatroom " + roomRef + " has been created.");
					chatrooms[roomRef].push(socket);
				}
				else {
					chatrooms[roomRef].push(socket);
					console.log("chatroom" + roomRef + " clients: " + chatrooms[roomRef].length);
				}

				socket.write("JOINED_CHATROOM:" + roomRef +
					"\nSERVER_IP: " + ADDRESS +
					"\nPORT: " + PORT +
					"\nROOM_REF: " + "1" +
					"\nJOIN_ID: " + join_id + "\n");

				chatrooms[roomRef].forEach(function(socket) {
					socket.write("CHAT:" + "1" + "\n" +
								splitData[3] + "\n" +
								"MESSAGE:" + splitData[3].split(':')[1] +
								" has joined the chatroom.\n\n");

				});
			}

			else if(dat.includes("MESSAGE:")) {

				var roomRef = "room" + splitData[0].split(':')[1];
				chatrooms[roomRef].forEach(function(socket) {
					socket.write(splitData[0] + "\n" +
					splitData[2] + "\n" +
					splitData[3] + "\n\n")
				});
			}

			else if(splitData[0].includes("LEAVE_CHATROOM:")) {

				var roomRef = " room" + splitData[0].split(': ')[1];
				console.log(roomRef + '\n\n');
				var roomRefNum = splitData[0].split(': ')[1];
				var joinId = splitData[1].split(':')[1];
				var clientName = splitData[2].split(':')[1];

				socket.write('LEFT_CHATROOM: ' + roomRefNum + '\n' +
					'JOIN_ID: ' + joinId + '\n');

				chatrooms[roomRef].forEach(function(socket) {

					socket.write('CHAT: ' + roomRefNum + '\n' +
						'CLIENT_NAME: ' + clientName + '\n' +
						'MESSAGE: ' + clientName + ' has left the chatroom\n\n');
				});

				if(chatrooms[roomRef].indexOf(socket) !== -1) {
					chatrooms[roomRef].splice(chatrooms[roomRef].indexOf(socket), 1);
				}
				console.log('There are now ' + chatrooms[roomRef].length + ' left in ' + roomRef)
			}

			else if(dat.includes("DISCONNECT:")) {
				socket.destroy();
			}

			else if(dat.includes("KILL_SERVICE")){
				socket.destroy();
				server.close();
			}

			else if (dat.includes("HELO")) {
				socket.write(dat +
					"IP:" + ADDRESS + "\n" +
					"Port:" + PORT + "\n" +
					"StudentID:133219802\n");
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
function splitMessagedata(dat) {
	var messagedata = '';
	messagedata += dat;
	var messagedataArray = messagedata.split("\n");

	return messagedataArray;
}
