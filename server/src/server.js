const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const httpServer = http.createServer(app);

// Create a Socket.IO server with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', // Define the allowed origin for socket connections
  },
});

// Create data structures to manage available users and conversations
const availableUsers = new Set();
const conversations = new Map();

io.on('connection', socket => {
  // Handle "findPartner" event when a user is looking for a partner
  socket.on('findPartner', user => {
    // Add the user to the set of available users
    availableUsers.add(user);

    if (availableUsers.size > 1) {
      // If there are at least 2 available users, find a partner
      const initiator = user;
      const recipient = [...availableUsers].find(user => user !== initiator);

      // Remove initiator and recipient from available users
      availableUsers.delete(initiator);
      availableUsers.delete(recipient);

      // Create a unique conversation ID and room name
      const conversationID = `${new Date().getSeconds()}-${conversations.size + 1}`;
      const roomName = `${initiator}-${recipient}`;

      // If the conversation does not exist, create it
      if (!conversations.has(conversationID)) {
        conversations.set(conversationID, {
          participants: [initiator, recipient],
          messages: [],
        });
      }

      // Emit an event to both users to initiate the conversation
      io.to([recipient, initiator]).emit('conversationInitiated', { conversationID, roomName });

      // Log available users and conversations
      // console.log(`Available Users: ${availableUsers}`);
      console.log(`Conversations: ${conversations}`);
    }
  });

  socket.on('sendMessage', ({ conversationId, message }) => {
    const conversation = conversations.get(conversationId);

    if (conversation) {
      // Add the message to the conversation and broadcast it to all participants
      conversation.messages.push(message);
      io.emit('messageReceived', { conversationIdSocket: conversationId, message });
    }
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server is alive on PORT:${PORT}`));
