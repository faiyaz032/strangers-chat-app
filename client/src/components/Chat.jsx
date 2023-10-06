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
    const connection = io('https://strangers-chat-app-server.onrender.com');
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

    socket.on('otherUserTyping', () => {
      // Handle when the other user is typing
      setTyping(true);
    });

    socket.on('otherUserStopTyping', () => {
      // Handle when the other user stops typing
      setTyping(false);
    });

    socket.on('conversationDismissed', () => {
      // Handle conversation dismissal (when the other user disconnects)
      setConversationFinished(true);
      setUserSkipped(true);
    });
  }, [socket, conversationId]);

  // Handle "Skip" button click
  const skipClickHandler = () => {
    // Emit "userSkipped" event (for debugging?)
    setUserSkipped(true);
    socket.emit('userSkipped', { conversationId, socketId });
  };

  // Handle "New" button click (seems to be missing server-side implementation)
  const newClickHandler = () => {
    setConversationStarted(false);
    socket.emit('newButtonClicked', socketId);
  };

  // Render the "Skip" or "New" button based on userSkipped state
  let dynamicButton;
  if (!userSkipped) {
    dynamicButton = <button onClick={skipClickHandler}>Skip</button>;
  } else {
    dynamicButton = <button onClick={newClickHandler}>New</button>;
  }

  return (
    <div className="messaging-container">
      <div className="messaging-header">
        <h3>{conversationStarted ? 'Conversation Started' : 'Finding Strangers....'}</h3>
      </div>
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

      {!conversationFinished && !userSkipped ? (
        <TextInput
          socket={socket}
          conversationId={conversationId}
          typing={typing}
          setTyping={setTyping}
        />
      ) : (
        <p>Conversation Dismissed</p>
      )}

      {typing && <p>Stranger is typing....</p>}
      {dynamicButton}
    </div>
  );
}
