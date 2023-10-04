import { useState } from 'react';

export default function TextInput() {
  const [text, setText] = useState('');

  const handleOnChange = e => {
    setText(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setText('');
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
