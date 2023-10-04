export default function Text({ type, message }) {
  return (
    <div className={type === 'receiver' ? 'message-received' : 'message-sent'}>
      <p>{message.text}</p>
    </div>
  );
}
