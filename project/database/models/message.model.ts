/**
 * Message Model
 * 
 * This file defines the Message model for the database.
 */

import { BaseDocument } from '../operations';
import { DB_CONFIG } from '../config';

// Message status
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
}

// Message type
export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  FILE = 'file',
  AUDIO = 'audio',
  VIDEO = 'video',
  LOCATION = 'location',
}

// Message interface
export interface Message extends BaseDocument {
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  type: MessageType;
  status: MessageStatus;
  isDeleted: boolean;
  deletedFor: string[];
  attachments?: {
    url: string;
    type: string;
    name?: string;
    size?: number;
  }[];
  metadata?: Record<string, any>;
}

// Conversation interface
export interface Conversation extends BaseDocument {
  participants: string[];
  lastMessageId?: string;
  lastMessageText?: string;
  lastMessageTime?: string;
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  createdBy?: string;
  admins?: string[];
  unreadCount?: Record<string, number>;
  isDeleted: boolean;
  deletedFor: string[];
}

// Collection names for messages
export const MESSAGES_COLLECTION = DB_CONFIG.COLLECTIONS.MESSAGES;
export const CONVERSATIONS_COLLECTION = 'conversations';

// Create a new message object with default values
export const createMessageObject = (
  senderId: string,
  receiverId: string,
  conversationId: string,
  content: string,
  type: MessageType = MessageType.TEXT
): Omit<Message, keyof BaseDocument> => {
  return {
    senderId,
    receiverId,
    conversationId,
    content,
    type,
    status: MessageStatus.SENT,
    isDeleted: false,
    deletedFor: [],
  };
};

// Create a new conversation object with default values
export const createConversationObject = (
  participants: string[],
  isGroup: boolean = false,
  groupName?: string,
  groupImage?: string,
  createdBy?: string
): Omit<Conversation, keyof BaseDocument> => {
  return {
    participants,
    isGroup,
    groupName,
    groupImage,
    createdBy,
    isDeleted: false,
    deletedFor: [],
    unreadCount: participants.reduce((acc, id) => {
      acc[id] = 0;
      return acc;
    }, {} as Record<string, number>),
  };
};
