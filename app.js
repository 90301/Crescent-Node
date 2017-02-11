var login = require("facebook-chat-api");
var fs = require('fs');
var prompt = require ('prompt');
var io  = require('socket.io').listen(3000),
    dl  = require('delivery'),
    fs  = require('fs');

	/**********************************************************
	* Starts a local node.js server
	*
    **********************************************************/
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Test\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

	/**********************************************************
	* Prompts user for login information
	* This will later be taken out, currently in-use
	* so testing developer doesn't have information saved
	*
    **********************************************************/
prompt.start();
prompt.get(['email', 'password'], function (err, result) {
  console.log('Login Successful!');
  
	/**********************************************************
	* Logs into Facebook using previously povided credentials
	*
    **********************************************************/
login({email: result.email, password: result.password}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({
      logLevel: "silent" //Turns off messageID notification
    });

	/**********************************************************
	* Begins listening for user chat data. 
	* Current functionality only allows for chat history
	* to be retrieved when the user sends/receives a message
	*
    **********************************************************/
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err); //Throws error

        switch(event.type) {
          case "message":
            if(event.body === '/stop') { //Ends the script
              	//api.sendMessage("Goodbye...", event.threadID);
              	return stopListening();
            }

            api.markAsRead(event.threadID, function(err) {
              	if(err) console.log(err);
            });

            console.log(event.body, event.threadID);
            
            chatHistory(0, 99, event.threadID); //Retrieves chat history (start, end, ID)

            fs.writeFile('myfile.txt',event.body, (err) => { //Writes retieved data to a file
              if(err) throw err;
                console.log('It\'s saved!');
            });

            break;

          case "event":
            console.log(event);
            break;
        }
    });

    /**********************************************************
	* Retrieves chat history based on parameters.
	* chatHistory(earliest message, furthest, input)
	*
    **********************************************************/
	function chatHistory(messageStart, messageEnd, event){
    	api.getThreadHistory(event, messageStart, messageEnd, null, function(err, history){
            if (err) throw err;

            for (var j = history.length - 2; j >= 0; j--){

            	console.log(history[j]);
            }
            
            console.log(event.body);

        })
    }

	/**********************************************************
	* Sends data packet once requested chat information
	* has been recorded.
	*
	* sendPacket(Recipient IP, Recipient Process port, 
	* Name to Save as, Path to Place in)
	*
    **********************************************************/
	function sendPacket(ip, port, fileName, filePath){
		var delivery = dl.listen(socket);
		var socket = io.connect(ip);

		socket.on( 'connect', function(err) {
			if (err) throw err;
  			log( "Sockets connected" );
        
  			delivery = dl.listen( socket );
  			delivery.connect();
    
  			delivery.on('delivery.connect',function(delivery){
    			delivery.send({
      				name: 'myfile.txt',
      				path : './myfile.txt'
    			});
 
    			delivery.on('send.success',function(file){
      				console.log('File sent successfully!');
    			});
  			});  
		});
	};
});