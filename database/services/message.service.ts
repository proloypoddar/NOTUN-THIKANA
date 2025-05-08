/**
 * Message Service
 * 
 * This file provides services for message-related operations.
 */

import { 
  findDocument, 
  findDocuments, 
  insertDocument, 
  updateDocument, 
  deleteDocument,
  documentExists,
  BaseDocument
} from '../operations';
import { 
  Message, 
  MessageType, 
  MessageStatus,
  Conversation,
  MESSAGES_COLLECTION,
  CONVERSATIONS_COLLECTION,
  createMessageObject,
  createConversationObject
} from '../models/message.model';

/**
 * Find a message by ID
 * @param id The ID of the message to find
 * @returns The message with the specified ID, or null if no message is found
 */
export const findMessageById = (id: string): Message | null => {
  return findDocument<Message>(MESSAGES_COLLECTION, { id });
};

/**
 * Find messages by conversation ID
 * @param conversationId The ID of the conversation
 * @returns An array of messages in the conversation
 */
export const findMessagesByConversation = (conversationId: string): Message[] => {
  return findDocuments<Message>(MESSAGES_COLLECTION, { conversationId, isDeleted: false })
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

/**
 * Find a conversation by ID
 * @param id The ID of the conversation to find
 * @returns The conversation with the specified ID, or null if no conversation is found
 */
export const findConversationById = (id: string): Conversation | null => {
  return findDocument<Conversation>(CONVERSATIONS_COLLECTION, { id });
};

/**
 * Find conversations by participant
 * @param userId The ID of the participant
 * @returns An array of conversations that the user is a participant in
 */
export const findConversationsByParticipant = (userId: string): Conversation[] => {
  // Find all conversations where the user is a participant and the conversation is not deleted for the user
  return findDocuments<Conversation>(CONVERSATIONS_COLLECTION)
    .filter(conversation => 
      conversation.participants.includes(userId) && 
      !conversation.deletedFor.includes(userId) &&
      !conversation.isDeleted
    )
    .sort((a, b) => {
      // Sort by last message time (most recent first)
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    });
};

/**
 * Find or create a conversation between two users
 * @param user1Id The ID of the first user
 * @param user2Id The ID of the second user
 * @returns The conversation between the two users
 */
export const findOrCreateConversation = (user1Id: string, user2Id: string): Conversation => {
  // Check if a conversation already exists between the two users
  const existingConversation = findDocuments<Conversation>(CONVERSATIONS_COLLECTION)
    .find(conversation => 
      !conversation.isGroup && 
      conversation.participants.includes(user1Id) && 
      conversation.participants.includes(user2Id) &&
      conversation.participants.length === 2
    );
  
  if (existingConversation) {
    return existingConversation;
  }
  
  // Create a new conversation
  const conversationObject = createConversationObject([user1Id, user2Id]);
  return insertDocument<Omit<Conversation, keyof BaseDocument>>(CONVERSATIONS_COLLECTION, conversationObject);
};

/**
 * Create a new message
 * @param senderId The ID of the sender
 * @param receiverId The ID of the receiver
 * @param content The content of the message
 * @param type The type of the message
 * @returns The created message
 */
export const createMessage = (
  senderId: string,
  receiverId: string,
  content: string,
  type: MessageType = MessageType.TEXT
): Message => {
  // Find or create a conversation between the sender and receiver
  const conversation = findOrCreateConversation(senderId, receiverId);
  
  // Create the message
  const messageObject = createMessageObject(senderId, receiverId, conversation.id, content, type);
  const message = insertDocument<Omit<Message, keyof BaseDocument>>(MESSAGES_COLLECTION, messageObject);
  
  // Update the conversation with the last message
  updateConversationLastMessage(conversation.id, message);
  
  return message;
};

/**
 * Create a new group conversation
 * @param participants The IDs of the participants
 * @param groupName The name of the group
 * @param groupImage The image of the group
 * @param createdBy The ID of the user who created the group
 * @returns The created conversation
 */
export const createGroupConversation = (
  participants: string[],
  groupName: string,
  groupImage?: string,
  createdBy?: string
): Conversation => {
  const conversationObject = createConversationObject(participants, true, groupName, groupImage, createdBy);
  return insertDocument<Omit<Conversation, keyof BaseDocument>>(CONVERSATIONS_COLLECTION, conversationObject);
};

/**
 * Update a conversation's last message
 * @param conversationId The ID of the conversation
 * @param message The last message
 * @returns The updated conversation
 */
export const updateConversationLastMessage = (
  conversationId: string,
  message: Message
): Conversation | null => {
  const conversation = findConversationById(conversationId);
  
  if (!conversation) {
    return null;
  }
  
  // Update unread count for all participants except the sender
  const unreadCount = { ...conversation.unreadCount };
  conversation.participants.forEach(participantId => {
    if (participantId !== message.senderId) {
      unreadCount[participantId] = (unreadCount[participantId] || 0) + 1;
    }
  });
  
  return updateDocument<Conversation>(CONVERSATIONS_COLLECTION, conversationId, {
    lastMessageId: message.id,
    lastMessageText: message.content,
    lastMessageTime: message.createdAt,
    unreadCount,
  });
};

/**
 * Mark messages as read
 * @param conversationId The ID of the conversation
 * @param userId The ID of the user who read the messages
 * @returns The number of messages marked as read
 */
export const markMessagesAsRead = (
  conversationId: string,
  userId: string
): number => {
  const conversation = findConversationById(conversationId);
  
  if (!conversation) {
    return 0;
  }
  
  // Find all unread messages in the conversation where the user is the receiver
  const unreadMessages = findDocuments<Message>(MESSAGES_COLLECTION, { 
    conversationId, 
    receiverId: userId,
    status: MessageStatus.DELIVERED,
  });
  
  // Mark each message as read
  unreadMessages.forEach(message => {
    updateDocument<Message>(MESSAGES_COLLECTION, message.id, {
      status: MessageStatus.READ,
    });
  });
  
  // Reset unread count for the user
  if (conversation.unreadCount && conversation.unreadCount[userId]) {
    const unreadCount = { ...conversation.unreadCount };
    unreadCount[userId] = 0;
    
    updateDocument<Conversation>(CONVERSATIONS_COLLECTION, conversationId, {
      unreadCount,
    });
  }
  
  return unreadMessages.length;
};

/**
 * Delete a message (soft delete)
 * @param messageId The ID of the message to delete
 * @param userId The ID of the user who is deleting the message
 * @returns True if the message was deleted, false otherwise
 */
export const deleteMessage = (
  messageId: string,
  userId: string
): boolean => {
  const message = findMessageById(messageId);
  
  if (!message) {
    return false;
  }
  
  // Check if the user is the sender or receiver
  if (message.senderId !== userId && message.receiverId !== userId) {
    return false;
  }
  
  // If both sender and receiver have deleted the message, mark it as deleted
  if (message.deletedFor.includes(userId === message.senderId ? message.receiverId : message.senderId)) {
    return updateDocument<Message>(MESSAGES_COLLECTION, messageId, {
      isDeleted: true,
    }) !== null;
  }
  
  // Otherwise, add the user to the deletedFor array
  return updateDocument<Message>(MESSAGES_COLLECTION, messageId, {
    deletedFor: [...message.deletedFor, userId],
  }) !== null;
};

/**
 * Delete a conversation (soft delete)
 * @param conversationId The ID of the conversation to delete
 * @param userId The ID of the user who is deleting the conversation
 * @returns True if the conversation was deleted, false otherwise
 */
export const deleteConversation = (
  conversationId: string,
  userId: string
): boolean => {
  const conversation = findConversationById(conversationId);
  
  if (!conversation) {
    return false;
  }
  
  // Check if the user is a participant
  if (!conversation.participants.includes(userId)) {
    return false;
  }
  
  // If all participants have deleted the conversation, mark it as deleted
  const otherParticipants = conversation.participants.filter(id => id !== userId);
  if (otherParticipants.every(id => conversation.deletedFor.includes(id))) {
    return updateDocument<Conversation>(CONVERSATIONS_COLLECTION, conversationId, {
      isDeleted: true,
    }) !== null;
  }
  
  // Otherwise, add the user to the deletedFor array
  return updateDocument<Conversation>(CONVERSATIONS_COLLECTION, conversationId, {
    deletedFor: [...conversation.deletedFor, userId],
  }) !== null;
};
