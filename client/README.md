# Strangers Chat - Client

This folder contains the client side code for a real-time chat application built with Node.js, Express, Socket.IO, and React. The application allows users to connect with random strangers in real-time and engage in text-based conversations.

### Live Link: https://6520141bcf4ea200735dadb5--calm-speculoos-1f865c.netlify.app/

## Features

**Server-Side:**

- Sets up a Node.js server using Express and Socket.IO.
- Manages real-time chat interactions.
- Handles user connections, message exchange, typing indicators, and disconnections.
- Uses a Redis database for data storage (Yet to implement).
- Provides a "Skip" functionality for users to match with new partners.
- Allows users to send and receive messages in real time.

**Client-Side:**

- Develops a React-based chat interface.
- Connects to the server using Socket.IO.
- Displays messages and typing indicators.
- Offers "Skip" and "New" buttons for user interactions.
- Communicates with the server to find conversation partners and exchange messages.
- Manages conversation status and updates in real time.
