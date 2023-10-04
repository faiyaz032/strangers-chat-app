/* eslint-disable react/prop-types */
import { useState } from 'react';
import debounce from '../utils/debounce';

export default function TextInput({ socket, conversationId, typing }) {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();

    const text = e.target[0].value;

    const message = {
      text,
      sender: socket.id,
      timestamp: new Date().toISOString(),
    };

    socket.emit('sendMessage', { conversationId, message });
    socket.emit('userStopTyping', { conversationId, typingUser: socket.id });

    setText('');
  };

  const handleOnChange = e => {
    setText(e.target.value);
    if (!typing) {
      socket.emit('userTyping', { conversationId, typingUser: socket.id });
    }

    //debouncing for tracking user typing status
    debounce(() => {
      socket.emit('userStopTyping', { conversationId, typingUser: socket.id });
    }, 4000);
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        placeholder="Type your message here..."
        value={text}
        onChange={handleOnChange}
        className="message-input"
      />
      <button type="submit" className="send-button">
        <i className="fa fa-paper-plane"></i>
        Send
      </button>
    </form>
  );
}
