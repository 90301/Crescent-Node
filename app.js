var login = require("facebook-chat-api");
var fs = require('fs');
var prompt = require ('prompt');
var io  = require('socket.io').listen(5001),
    dl  = require('delivery'),
    fs  = require('fs');
var v = require('globals');

global.name = 'v';
global.name = 'f';

//prompt.start();
//prompt.get(['email', 'password'], function (err, result) {
//  console.log('Login Successful!');

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
//{email: result.email, password: result.password}
login({email: 'tornadotroy8@yahoo.com', password: 'associate1808346'}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({
      logLevel: "silent"
    });

    var stopListening = api.listen(function(err, event, save) {
        if(err) return console.error(err);

        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              //api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            console.log(event.body, event.threadID);
            
            chatHistory(0, 99, event.threadID);

            fs.writeFile('myfile.txt',event.body, (err) => {
              if(err) throw err;
                console.log('It\'s saved!');
                  });

            break;
          case "event":
            console.log(event);
            break;
        }
    });

    function chatHistory(messageStart, messageEnd, event){
    	api.getThreadHistory(event, messageStart, messageEnd, null, function(err, history){
            	if (err) throw err;

            	for (var j = history.length - 2; j >= 0; j--){
            		//console.log(history[j].body);
            		console.log(history[j]);
            		//output(api, event, history[j], save);
            	}
              console.log(event.body);

            })
    }
});

/*
var delivery = dl.listen(socket);
var socket = io.connect('http//127.0.0.1:3000');

socket.on( 'connect', function() {
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
});*/