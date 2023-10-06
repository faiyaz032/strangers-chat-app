const initiateConversation = require('./utils/initiateConversation');

class SocketManager {
  constructor(io) {
    //initialize io object
    this.io = io;
    // Create data structures to manage available users and conversations
    this.availableUsers = new Set();
    this.conversations = new Map();
  }

  //this public methods handles all the socket connection
  handleConnection(socket) {
    socket.on('findPartner', user => this._handleFindPartner(user));
    socket.on('sendMessage', data => this._handleSendMessage(data));
    socket.on('userTyping', data => this._handleUserTyping(data));
    socket.on('userStopTyping', data => this._handleUserStopTyping(data));
    socket.on('userSkipped', data => this._handleUserSkipped(data));
    socket.on('newButtonClicked', user => this._handleNewButtonClicked(user));
    socket.on('disconnect', () => this._handleDisconnect(socket));
  }

  _handleFindPartner(user) {
    initiateConversation(this.io, this.availableUsers, this.conversations, user);
  }

  _handleSendMessage(data) {
    const conversation = this.conversations.get(data.conversationId);

    if (conversation) {
      // Add the message to the conversation and broadcast it to all participants
      conversation.messages.push(data.message);
      this.io.emit('messageReceived', {
        conversationIdSocket: data.conversationId,
        message: data.message,
      });
    }
  }

  _handleUserTyping(data) {
    // Implementation for handling user typing event
    const otherUser = this.conversations
      .get(data.conversationId)
      ?.participants?.find(u => u !== data.typingUser);

    // Emit an event to inform the other user that someone is typing
    this.io.to(otherUser).emit('otherUserTyping', otherUser);
  }

  _handleUserStopTyping(data) {
    const otherUser = this.conversations
      .get(data.conversationId)
      ?.participants.find(u => u !== data.typingUser);

    // Emit an event to inform the other user that someone stopped typing
    this.io.to(otherUser).emit('otherUserStopTyping', otherUser);
  }

  _handleUserSkipped(data) {
    const skippedConversation = this.conversations.get(data.conversationId);
    this.io.to(skippedConversation?.participants).emit('conversationDismissed');
  }

  _handleNewButtonClicked(user) {
    initiateConversation(this.io, this.availableUsers, this.conversations, user);
  }

  _handleDisconnect(socket) {
    let conversationID;

    // Find the conversation ID associated with the disconnected user
    this.conversations.forEach((conversation, id) => {
      if (conversation.participants.includes(socket.id)) {
        conversationID = id;
      }
    });

    if (conversationID) {
      // Notify participants and remove the conversation
      const currentConversation = this.conversations.get(conversationID);
      this.io.to(currentConversation?.participants).emit('conversationDismissed');
      this.conversations.delete(conversationID);
    }
  }
}

module.exports = SocketManager;
