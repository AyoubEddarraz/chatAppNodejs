const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let listOfUsers = [];
let listOfMessages = [];

app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public');
})

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('chat message', (msg) => {
    listOfMessages.push(msg);
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on('user connected', (msg) => {
    listOfUsers.push(msg);
    console.log('message: ' + listOfUsers);
    io.emit('user connected', listOfUsers); 
  });

});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
