const express = require('express')
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/'))

let thisUser;

//log activity, for now just to console, but can be stored in a file if needed
io.on('connection', function(socket){
  socket.on('new user', function(user) {
    //validate user??
    thisUser = user;
    console.log(`${thisUser} joined`);
    io.emit('user added', Object.keys(io.sockets.sockets).length);
  });

  socket.on('chat message', function(msg){
  	console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('disconnect', function(){
    console.log(`${thisUser} disconnected`);
    io.emit('user left', Object.keys(io.sockets.sockets).length);
  });


});

http.listen(PORT, function(){
  console.log(`listening on *:${PORT}`);
});