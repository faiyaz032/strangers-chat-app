import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Text from './Text';
import TextInput from './TextInput';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversationFinished, setConversationFinished] = useState(false);
  const [userSkipped, setUserSkipped] = useState(false);

  // Establish a socket.io connection to the server
  useEffect(() => {
    const connection = io('http://localhost:5000');
    connection.on('connect', () => {
      setSocketId(connection.id);
      setSocket(connection);
    });
  }, []);

  // Emit "findPartner" event to start looking for a conversation partner
  useEffect(() => {
    if (!socket) return;

    socket.emit('findPartner', socketId);
  }, [socket, socketId]);

  useEffect(() => {
    if (!socket) return;

    // Handle the initiation of a conversation
    socket.on('conversationInitiated', ({ conversationID }) => {
      console.log('hitting conversation initiated');
      setConversationStarted(true);
      setConversationId(conversationID);
      setConversationFinished(false);
      setUserSkipped(false);
      setMessages([]);
    });

    socket.on('messageReceived', ({ conversationIdSocket, message }) => {
      // Handle received messages and add them to the state
      if (conversationIdSocket === conversationId) {
        setMessages(state => [...state, message]);
      }
    });
  }, [socket, conversationId]);

  return (
    <div className="messaging-container">
      {/* Display messages or a message indicating no messages */}
      <div className="messages-display">
        {messages.length
          ? messages.map(message => (
              <Text
                key={message.text}
                type={message.sender !== socket.id ? 'receiver' : 'sender'}
                message={message}
              />
            ))
          : 'No Messages Found'}
      </div>

      <TextInput
        socket={socket}
        conversationId={conversationId}
        typing={typing}
        setTyping={setTyping}
      />

      <p>{conversationStarted ? 'Conversation Started' : 'Find Strangers....'}</p>
    </div>
  );
}
