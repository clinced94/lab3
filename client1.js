var net = require('net');

var HOST = 'localhost';
var PORT = 8000;

var client = new net.Socket();
client.connect(PORT, HOST, function() {

	console.log('Connection Successful \n' + 'Connected to: ' + HOST + ':' + PORT + '\n');
	client.write("JOIN_CHATROOM:Chatroom1\n" +
        "\nCLIENT_IP:135.444.0.7\n" +
        "\nPORT:8000\n" +
        "\nCLIENT_NAME:iH8DisShit\n\n\n");


  client.write("CHAT:Chatroom1\n" +
        "JOIN_ID:123\n" +
        "CLIENT_NAME:iH8DisShit\n" +
        "MESSAGE:this is the worst thing I've ever had to do in my 4 years in college. \n\n");
});

client.on('data', function(data) {

	console.log('DATA: ' + data + '\n');

});

client.on('close', function() {
	console.log('Connection closed');
});
