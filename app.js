var login = require("facebook-chat-api");
var fs = require('fs');
var prompt = require ('prompt');

prompt.start();
prompt.get(['email', 'password'], function (err, result) {
  console.log('Login Successful!');


login({email: result.email, password: result.password}, function callback (err, api) {
    if(err) return console.error(err);

    api.setOptions({
      logLevel: "silent"
    });


    var stopListening = api.listen(function(err, event) {
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
            

            api.getThreadHistory(event.threadID, 0, 5, new Date().getTime(), function(err, data){

              console.log(event.body);

            })

            //while (event.body != '/stop' || )
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
});
});
