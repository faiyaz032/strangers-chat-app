const initiateConversation = (io, availableUsers, conversations, user) => {
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
};

module.exports = initiateConversation;
