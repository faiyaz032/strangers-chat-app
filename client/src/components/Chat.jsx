import Text from './Text';
import TextInput from './TextInput';

export default function Chat() {
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
