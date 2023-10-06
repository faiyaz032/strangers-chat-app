const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const SocketManager = require('./SocketManager');

const app = express();
const httpServer = http.createServer(app);

// Create a Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Define the allowed origin for socket connections
  },
});

//create socket manager instance
const socketManager = new SocketManager(io);

io.on('connection', socket => {
  socketManager.handleConnection(socket);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is alive on PORT:${PORT}`));
