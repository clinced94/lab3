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


//TODO: implement chatrooms
var chatrooms = {};

var clients = [];
var join_id = 0;



var server = net.createServer();

server.on('connection', function(socket) {

	var socketAddress = socket.remoteAddress + ':' + socket.remotePort;
	console.log('Connection established\n' + socketAddress + ' has connected');

	socket.on("data", function(dat) {

			if(dat.includes("JOIN_CHATROOM:")) {

				var splitmsgdata = splitMessagedata(dat);
				//console.log(splitmsgdata);

				var roomRef = splitmsgdata[0].split(':')[1];
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

				socket.write("JOINED_CHATROOM:" + splitmsgdata[0].split(':')[1] +
					"\nSERVER_IP: " + ADDRESS +
					"\nPORT: " + PORT +
					"\nROOM_REF: " + "1" +
					"\nJOIN_ID: " + join_id + "\n");

				chatrooms[roomRef].forEach(function(socket) {
					socket.write("CHAT:" + "1" + "\n" +
								splitmsgdata[3] + "\n" +
								"MESSAGE:" + splitmsgdata[3].split(':')[1] +
								" has joined the chatroom.\n");

				});
			}

			else if(dat.includes("MESSAGE:")) {
				var splitmsgdata = splitMessagedata(dat);

				clients.forEach(function(socket) {
					socket.write(splitmsgdata[0] + "\n" +
					splitmsgdata[2] + "\n" + splitmsgdata[3] + "\n\n")
				});
			}

			else if(dat.includes("LEAVE_CHATROOM:")) {

				var splitmsgdata = splitMessagedata(dat);
				console.log(splitmsgdata);

				var roomRef = splitmsgdata[0].split(':')[1];
				var joinId = splitmsgdata[1];
				var clientName = splitmsgdata[2];

				socket.write("LEFT_CHATROOM: " + roomRef +"\n"
					+ joinId + "\n");

				chatrooms[roomRef].forEach(function(socket) {
					socket.write('LEFT_CHATROOM: ' +
					roomRef + "\n" +
					joinId + "\n" +
					clientName + "\n");
				});
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
