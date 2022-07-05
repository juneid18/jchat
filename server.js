const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const user = {}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat-message', (msg) => {
      socket.broadcast.emit('chat-message', msg)
        // io.emit('chat-message', msg);
    });

    socket.on('new-user', name => {
        user[socket.id] = name ;
        socket.broadcast.emit('user-connect', name)
    });

    socket.on('disconnect', name => {
        socket.broadcast.emit('user-disconnect', user[socket.id])
        delete user[socket.id];
    });
  });


  
  

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`listening on :${PORT}`);
});