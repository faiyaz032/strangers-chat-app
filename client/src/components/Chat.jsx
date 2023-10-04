import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Text from './Text';
import TextInput from './TextInput';

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  // Establish a socket.io connection to the server
  useEffect(() => {
    const connection = io('http://localhost:5000');
    setSocket(connection);
    setSocketId(connection.id);
  }, []);

  return (
    <div className="messaging-container">
      {/* Display messages or a message indicating no messages */}
      <div className="messages-display">
        <Text key="1" type="sender" message={{ text: 'hello there' }} />
      </div>

      <TextInput />

      <p>Finding Stranger</p>
    </div>
  );
}
