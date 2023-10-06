const http = require('http');
const { Server } = require('socket.io');
const SocketManager = require('./SocketManager');

const httpServer = http.createServer();

// Create a Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    // Define the allowed origin for socket connections
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
  },
});

//create socket manager instance
const socketManager = new SocketManager(io);

io.on('connection', socket => {
  socketManager.handleConnection(socket);
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is alive on PORT:${PORT}`));
